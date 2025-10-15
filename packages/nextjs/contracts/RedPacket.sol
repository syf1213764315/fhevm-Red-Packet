// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RedPacket {
    struct Packet {
        address creator;
        uint256 totalAmount;
        uint256 remainingAmount;
        uint256 totalPackets;
        uint256 claimedPackets;
        string password;
        bool isPasswordProtected;
        bool isActive;
        uint256 createdAt;
        uint256 expiresAt;
        mapping(address => bool) claimed;
    }

    mapping(uint256 => Packet) public packets;
    uint256 public nextPacketId = 1;

    event PacketCreated(
        uint256 indexed packetId,
        address indexed creator,
        uint256 totalAmount,
        uint256 totalPackets,
        bool isPasswordProtected,
        uint256 expiresAt
    );

    event PacketClaimed(
        uint256 indexed packetId,
        address indexed claimer,
        uint256 amount
    );

    event PacketRefunded(
        uint256 indexed packetId,
        address indexed creator,
        uint256 amount
    );

    function createPacket(
        uint256 totalPackets,
        string memory password,
        uint256 durationInHours
    ) external payable returns (uint256) {
        require(msg.value > 0, "Must send ETH");
        require(totalPackets > 0, "Must have at least 1 packet");
        require(totalPackets <= 100, "Too many packets");
        require(durationInHours > 0 && durationInHours <= 720, "Invalid duration");

        uint256 packetId = nextPacketId++;
        Packet storage packet = packets[packetId];
        
        packet.creator = msg.sender;
        packet.totalAmount = msg.value;
        packet.remainingAmount = msg.value;
        packet.totalPackets = totalPackets;
        packet.claimedPackets = 0;
        packet.password = password;
        packet.isPasswordProtected = bytes(password).length > 0;
        packet.isActive = true;
        packet.createdAt = block.timestamp;
        packet.expiresAt = block.timestamp + (durationInHours * 1 hours);

        emit PacketCreated(
            packetId,
            msg.sender,
            msg.value,
            totalPackets,
            packet.isPasswordProtected,
            packet.expiresAt
        );

        return packetId;
    }

    function claimPacket(uint256 packetId, string memory password) external {
        Packet storage packet = packets[packetId];
        
        require(packet.creator != address(0), "Packet does not exist");
        require(packet.isActive, "Packet is not active");
        require(block.timestamp <= packet.expiresAt, "Packet has expired");
        require(!packet.claimed[msg.sender], "Already claimed");
        require(packet.claimedPackets < packet.totalPackets, "All packets claimed");
        
        if (packet.isPasswordProtected) {
            require(
                keccak256(bytes(password)) == keccak256(bytes(packet.password)),
                "Incorrect password"
            );
        }

        // Calculate random amount (simple pseudo-random)
        uint256 maxAmount = (packet.remainingAmount * 2) / (packet.totalPackets - packet.claimedPackets);
        uint256 amount = (uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            packetId
        ))) % maxAmount) + 1;
        
        // Ensure we don't exceed remaining amount
        if (amount > packet.remainingAmount) {
            amount = packet.remainingAmount;
        }

        packet.claimed[msg.sender] = true;
        packet.claimedPackets++;
        packet.remainingAmount -= amount;

        if (packet.claimedPackets == packet.totalPackets || packet.remainingAmount == 0) {
            packet.isActive = false;
        }

        payable(msg.sender).transfer(amount);

        emit PacketClaimed(packetId, msg.sender, amount);
    }

    function refundPacket(uint256 packetId) external {
        Packet storage packet = packets[packetId];
        
        require(packet.creator == msg.sender, "Not the creator");
        require(packet.isActive, "Packet is not active");
        require(packet.remainingAmount > 0, "No funds to refund");

        uint256 refundAmount = packet.remainingAmount;
        packet.remainingAmount = 0;
        packet.isActive = false;

        payable(msg.sender).transfer(refundAmount);

        emit PacketRefunded(packetId, msg.sender, refundAmount);
    }

    function getPacketInfo(uint256 packetId) external view returns (
        address creator,
        uint256 totalAmount,
        uint256 remainingAmount,
        uint256 totalPackets,
        uint256 claimedPackets,
        bool isPasswordProtected,
        bool isActive,
        uint256 createdAt,
        uint256 expiresAt
    ) {
        Packet storage packet = packets[packetId];
        return (
            packet.creator,
            packet.totalAmount,
            packet.remainingAmount,
            packet.totalPackets,
            packet.claimedPackets,
            packet.isPasswordProtected,
            packet.isActive,
            packet.createdAt,
            packet.expiresAt
        );
    }

    function hasClaimed(uint256 packetId, address claimer) external view returns (bool) {
        return packets[packetId].claimed[claimer];
    }
}