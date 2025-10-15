"use client";

import React, { useState } from "react";
import { RED_PACKET_ABI, getRedPacketAddress } from "../../../utils/redPacketConfig";
import toast from "react-hot-toast";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

export const ClaimRedPacket = () => {
  const { address, chain } = useAccount();
  const [packetId, setPacketId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [claimedAmount] = useState("");
  const [packetInfo, setPacketInfo] = useState<any>(null);

  const contractAddress = chain?.id ? getRedPacketAddress(chain.id) : null;

  const { writeContractAsync, isPending } = useWriteContract();

  // Get packet info
  const {
    data: packetData,
    refetch: refetchPacket,
    isFetching: isContractFetching,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: RED_PACKET_ABI,
    functionName: "getPacketInfo",
    args: packetId ? [BigInt(packetId)] : undefined,
    query: {
      enabled: !!packetId && !!contractAddress,
    },
  });

  // Update packetInfo when packetData changes
  React.useEffect(() => {
    if (packetData) {
      setPacketInfo(packetData);
    }
  }, [packetData]);

  const fetchPacketInfo = async () => {
    if (!packetId || !contractAddress) {
      toast.error("Please enter a red packet ID");
      return;
    }

    try {
      await refetchPacket();
      toast.success("Red packet info retrieved successfully");
    } catch (error) {
      console.error("Failed to get red packet info:", error);
      toast.error("Failed to get red packet info");
    }
  };

  const claimPacket = async () => {
    if (!packetId || !contractAddress || !address) {
      toast.error("Please connect wallet and enter red packet ID");
      return;
    }

    setIsLoading(true);
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: RED_PACKET_ABI,
        functionName: "claimPacket",
        args: [BigInt(packetId), password],
      });

      setTxHash("Transaction submitted successfully");
      toast.success("Claim successful!");

      // Refresh packet info
      await refetchPacket();
    } catch (error: any) {
      console.error("Claim failed:", error);
      toast.error(error?.message || "Claim failed");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const formatAmount = (amount: bigint) => {
    return formatEther(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Claim Red Packet</h2>

        <div className="space-y-6">
          {/* Packet ID Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Red Packet ID</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter red packet ID"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                value={packetId}
                onChange={e => setPacketId(e.target.value)}
              />
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={fetchPacketInfo}
                disabled={isContractFetching || !packetId}
              >
                {isContractFetching ? "Loading..." : "Query"}
              </button>
            </div>
          </div>

          {/* Packet Info Display */}
          {packetInfo && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-xl">
              <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200">Red Packet Info</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Creator:</span>
                  <p className="text-gray-900 dark:text-gray-100 font-mono text-xs">{packetInfo[0]}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Total Amount:</span>
                  <p className="text-gray-900 dark:text-gray-100">{formatAmount(packetInfo[1])} ETH</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Remaining:</span>
                  <p className="text-gray-900 dark:text-gray-100">{formatAmount(packetInfo[2])} ETH</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Total Packets:</span>
                  <p className="text-gray-900 dark:text-gray-100">{packetInfo[3].toString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Claimed:</span>
                  <p className="text-gray-900 dark:text-gray-100">{packetInfo[4].toString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Password Protected:</span>
                  <p className="text-gray-900 dark:text-gray-100">{packetInfo[5] ? "Yes" : "No"}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Status:</span>
                  <p
                    className={`font-bold ${packetInfo[6] ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {packetInfo[6] ? "Active" : "Ended"}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Created:</span>
                  <p className="text-gray-900 dark:text-gray-100 text-xs">{formatTime(packetInfo[7])}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Expires:</span>
                  <p className="text-gray-900 dark:text-gray-100 text-xs">{formatTime(packetInfo[8])}</p>
                </div>
              </div>
            </div>
          )}

          {/* Password Input (if protected) */}
          {packetInfo && packetInfo[5] && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          )}

          {/* Claim Button */}
          <button
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={claimPacket}
            disabled={isLoading || isPending || !packetInfo || !packetInfo[6]}
          >
            {isLoading || isPending ? "Claiming..." : "Claim Red Packet"}
          </button>

          {/* Transaction Hash */}
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
                  <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">Transaction Successful!</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    Transaction Hash:{" "}
                    <code className="text-xs bg-green-100 dark:bg-green-800 px-2 py-1 rounded">{txHash}</code>
                  </p>
                  {claimedAmount && (
                    <p className="text-sm text-green-700 dark:text-green-300">Claimed Amount: {claimedAmount} ETH</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
