"use client";

import { useEffect, useState } from "react";
import { NetworkError } from "../../components/NetworkError";
import { getRedPacketAddress } from "../../utils/redPacketConfig";
import { ClaimRedPacket } from "./RedPacket/ClaimRedPacket";
import { CreateRedPacket } from "./RedPacket/CreateRedPacket";
import { MyRedPackets } from "./RedPacket/MyRedPackets";
import { WalletDebug } from "./WalletDebug";
import { useAccount } from "wagmi";

export const RedPacketDApp = () => {
  const { address, chain } = useAccount();
  const [activeTab, setActiveTab] = useState<"create" | "claim" | "my">("create");
  const [networkError, setNetworkError] = useState<string>("");

  // Check if contract is available on current network
  useEffect(() => {
    if (chain?.id) {
      try {
        getRedPacketAddress(chain.id);
        setNetworkError("");
      } catch (error: any) {
        setNetworkError(error.message);
      }
    }
  }, [chain?.id]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 p-1 mb-8 shadow-2xl">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 blur-xl opacity-30 animate-pulse"></div>
              <div className="relative text-6xl md:text-8xl">🧧</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Red Packet dApp
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-6">
              Send and receive red packets on the blockchain. Create password-protected or public red packets and share
              the joy with your friends!
            </p>
            {!address && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-lg max-w-md">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-blue-500 shrink-0 w-6 h-6 mr-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-blue-700 dark:text-blue-300">Please connect your wallet to get started</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Debug Component */}
      <WalletDebug />

      {/* Navigation Tabs */}
      {address && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 mb-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <button
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab("create")}
            >
              <span className="text-2xl mr-2">✨</span>
              Create Red Packet
            </button>
            <button
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                activeTab === "claim"
                  ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab("claim")}
            >
              <span className="text-2xl mr-2">🎁</span>
              Claim Red Packet
            </button>
            <button
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                activeTab === "my"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab("my")}
            >
              <span className="text-2xl mr-2">📦</span>
              My Red Packets
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {address && (
        <div className="animate-fade-in">
          {networkError ? (
            <NetworkError
              error={networkError}
              onRetry={() => {
                if (chain?.id) {
                  try {
                    getRedPacketAddress(chain.id);
                    setNetworkError("");
                  } catch (error: any) {
                    setNetworkError(error.message);
                  }
                }
              }}
            />
          ) : (
            <>
              {activeTab === "create" && <CreateRedPacket />}
              {activeTab === "claim" && <ClaimRedPacket />}
              {activeTab === "my" && <MyRedPackets />}
            </>
          )}
        </div>
      )}

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Password Protected</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Create private red packets that can only be claimed with the correct password
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl mb-6">🌐</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Public Red Packets</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Share red packets with everyone - first come, first served!
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl mb-6">🎲</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Random Amounts</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Each red packet contains a random amount - adding excitement to every claim!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
