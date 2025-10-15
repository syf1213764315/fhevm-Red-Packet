"use client";

import { useState } from "react";
import { RED_PACKET_ABI, getRedPacketAddress } from "../../../utils/redPacketConfig";
import { useAccount, useReadContract } from "wagmi";

export const MyRedPackets = () => {
  const { address, chain } = useAccount();
  const [error] = useState("");

  const contractAddress = chain?.id ? getRedPacketAddress(chain.id) : null;

  // Get next packet ID to know how many packets exist
  const {} = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: RED_PACKET_ABI,
    functionName: "nextPacketId",
    query: {
      enabled: !!contractAddress,
    },
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">My Red Packets</h2>
          <button
            className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold rounded-xl shadow-lg cursor-not-allowed opacity-50"
            disabled={true}
          >
            Coming Soon
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
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

        {!address ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-xl text-gray-600 dark:text-gray-400">Please connect your wallet first</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">My Red Packets</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Coming Soon!</p>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              This feature is under development. We&apos;re working on a better way to track your created red packets.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> Your red packets are safely stored on the blockchain. This feature will help you
                manage them more easily.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
