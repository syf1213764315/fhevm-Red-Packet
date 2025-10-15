// Red Packet contract addresses for different networks
const RED_PACKET_ADDRESSES: Record<number, string> = {
  31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Hardhat local
  11155111: "0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F", // Sepolia - Successfully deployed with random packet ID!
};

export const getRedPacketAddress = (chainId: number): string => {
  const address = RED_PACKET_ADDRESSES[chainId];
  if (!address || address === "0x0000000000000000000000000000000000000000") {
    if (chainId === 1) {
      throw new Error(
        `Red Packet contract is not deployed on Mainnet (Chain ID: 1). Please switch to Sepolia testnet (Chain ID: 11155111) to use the dApp.`,
      );
    }
    throw new Error(
      `Red Packet contract not deployed on network ${chainId}. Please switch to Sepolia testnet (Chain ID: 11155111) or deploy the contract first.`,
    );
  }
  return address;
};

// For backward compatibility
export const RED_PACKET_ADDRESS = RED_PACKET_ADDRESSES[31337];

export const RED_PACKET_ABI = [
  {
    type: "event",
    name: "PacketCreated",
    inputs: [
      { name: "packetId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "totalAmount", type: "uint256", indexed: false },
      { name: "totalPackets", type: "uint256", indexed: false },
      { name: "isPasswordProtected", type: "bool", indexed: false },
      { name: "expiresAt", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "PacketClaimed",
    inputs: [
      { name: "packetId", type: "uint256", indexed: true },
      { name: "claimer", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "PacketRefunded",
    inputs: [
      { name: "packetId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "function",
    name: "createPacket",
    inputs: [
      { name: "totalPackets", type: "uint256" },
      { name: "password", type: "string" },
      { name: "durationInHours", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "claimPacket",
    inputs: [
      { name: "packetId", type: "uint256" },
      { name: "password", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "refundPacket",
    inputs: [{ name: "packetId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getPacketInfo",
    inputs: [{ name: "packetId", type: "uint256" }],
    outputs: [
      { name: "creator", type: "address" },
      { name: "totalAmount", type: "uint256" },
      { name: "remainingAmount", type: "uint256" },
      { name: "totalPackets", type: "uint256" },
      { name: "claimedPackets", type: "uint256" },
      { name: "isPasswordProtected", type: "bool" },
      { name: "isActive", type: "bool" },
      { name: "createdAt", type: "uint256" },
      { name: "expiresAt", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasClaimed",
    inputs: [
      { name: "packetId", type: "uint256" },
      { name: "claimer", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextPacketId",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;
