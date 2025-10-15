"use client";

import { useEffect, useState } from "react";
import { RED_PACKET_ABI, getRedPacketAddress } from "../../../utils/redPacketConfig";
import toast from "react-hot-toast";
import { keccak256, parseEther, toHex } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const CreateRedPacket = () => {
  const { address, chain } = useAccount();
  const [amount, setAmount] = useState("");
  const [totalPackets, setTotalPackets] = useState("5");
  const [password, setPassword] = useState("");
  const [duration, setDuration] = useState("24");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [packetId, setPacketId] = useState("");
  const [error, setError] = useState("");
  const [isWaitingForPacketId, setIsWaitingForPacketId] = useState(false);

  const contractAddress = chain?.id ? getRedPacketAddress(chain.id) : null;

  const { writeContractAsync, isPending, data: writeData } = useWriteContract();

  // Wait for transaction receipt to get the packet ID from events
  const { data: receipt, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Extract packet ID from transaction receipt events
  useEffect(() => {
    if (receipt && isConfirmed) {
      setIsWaitingForPacketId(true);

      // Calculate the event signature hash
      const eventSignature = "PacketCreated(uint256,address,uint256,uint256,bool,uint256)";
      const eventTopic = keccak256(toHex(eventSignature));

      // Find the PacketCreated event in the logs
      const packetCreatedEvent = receipt.logs.find(log => {
        return log.topics[0] === eventTopic;
      });

      if (packetCreatedEvent && packetCreatedEvent.topics.length >= 2) {
        // packetId is the first indexed parameter (topics[1])
        const packetIdBigInt = BigInt(packetCreatedEvent.topics[1] || "0");
        setPacketId(packetIdBigInt.toString());
        console.log("Extracted packet ID:", packetIdBigInt.toString());
        setIsWaitingForPacketId(false);
      } else {
        // If no event found, wait a bit more
        setTimeout(() => {
          setIsWaitingForPacketId(false);
        }, 3000);
      }
    }
  }, [receipt, isConfirmed]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setTxHash("");
    setPacketId("");

    try {
      if (!contractAddress || !address) {
        throw new Error("Please connect your wallet");
      }

      const amountWei = parseEther(amount);
      const packets = parseInt(totalPackets);
      const hours = parseInt(duration);

      if (packets < 1 || packets > 100) {
        throw new Error("Number of packets must be between 1-100");
      }

      if (hours < 1 || hours > 720) {
        throw new Error("Duration must be between 1-720 hours");
      }

      const hash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: RED_PACKET_ABI,
        functionName: "createPacket",
        args: [BigInt(packets), password, BigInt(hours)],
        value: amountWei,
      });

      // Set transaction hash and show success message
      setTxHash(hash);
      toast.success("Red Packet Created Successfully!");

      // Reset form immediately
      setAmount("");
      setTotalPackets("5");
      setPassword("");
      setDuration("24");
    } catch (error: any) {
      console.error("Failed to create red packet:", error);
      setError(error?.message || "Failed to create red packet");
      toast.error(error?.message || "Failed to create red packet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Create Red Packet</h2>

        <form onSubmit={handleCreate} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Amount (ETH)</label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              placeholder="Enter total red packet amount"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Total Packets */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Number of Packets</label>
            <input
              type="number"
              min="1"
              max="100"
              placeholder="Number of packets"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              value={totalPackets}
              onChange={e => setTotalPackets(e.target.value)}
              required
            />
          </div>

          {/* Password (Optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password (Optional)</label>
            <input
              type="password"
              placeholder="Set password protection"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">Leave empty for public red packet</p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Duration (Hours)</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              required
            >
              <option value="1">1 hour</option>
              <option value="6">6 hours</option>
              <option value="12">12 hours</option>
              <option value="24">24 hours</option>
              <option value="72">3 days</option>
              <option value="168">7 days</option>
              <option value="720">30 days</option>
            </select>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading || isPending || !amount || !totalPackets || !duration}
          >
            {isLoading || isPending ? "Creating..." : "Create Red Packet"}
          </button>

          {/* Success Message */}
          {txHash && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">
                    Red Packet Created Successfully!
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    Transaction Hash:{" "}
                    <code className="text-xs bg-green-100 dark:bg-green-800 px-2 py-1 rounded">{txHash}</code>
                  </p>
                  {isWaitingForPacketId ? (
                    <div className="flex items-center text-sm text-green-700 dark:text-green-300 mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
                      Extracting Red Packet ID...
                    </div>
                  ) : packetId ? (
                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                      Red Packet ID:{" "}
                      <code className="text-xs bg-green-100 dark:bg-green-800 px-2 py-1 rounded">{packetId}</code>
                    </p>
                  ) : null}
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Amount: {amount} ETH | Packets: {totalPackets} | Duration: {duration} hours
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
