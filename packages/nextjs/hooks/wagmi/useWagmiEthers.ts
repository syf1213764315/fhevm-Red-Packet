"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export const useWagmiEthers = (initialMockChains?: Readonly<Record<number, string>>) => {
  const { address, isConnected, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const chainId = chain?.id ?? walletClient?.chain?.id;
  const accounts = address ? [address] : undefined;

  // Mock ethers-compatible providers for backward compatibility
  const ethersProvider = useMemo(() => {
    if (!walletClient) return undefined;

    // Return a mock ethers provider interface
    return {
      getNetwork: async () => ({ chainId: chainId || 1 }),
      getBlockNumber: async () => (await publicClient?.getBlockNumber()) || 0n,
      call: async (transaction: any) => {
        // Mock implementation - in real usage, this would use viem's equivalent
        console.log("Mock ethers provider call:", transaction);
        return "0x";
      },
      sendTransaction: async (transaction: any) => {
        // Mock implementation
        console.log("Mock ethers provider sendTransaction:", transaction);
        return { hash: "0x" };
      },
    };
  }, [walletClient, chainId, publicClient]);

  const ethersReadonlyProvider = useMemo(() => {
    if (!publicClient) return undefined;

    // Return a mock readonly provider interface
    return {
      getNetwork: async () => ({ chainId: chainId || 1 }),
      getBlockNumber: async () => (await publicClient.getBlockNumber()) || 0n,
      call: async (transaction: any) => {
        // Use viem's publicClient for read operations
        try {
          const result = await publicClient.call({
            to: transaction.to,
            data: transaction.data,
          });
          return result.data || "0x";
        } catch (error) {
          console.error("Mock provider call error:", error);
          return "0x";
        }
      },
    };
  }, [publicClient, chainId]);

  const ethersSigner = useMemo(() => {
    if (!walletClient || !address) return undefined;

    // Return a mock signer interface
    return {
      getAddress: () => address,
      signMessage: async (message: string) => {
        // Mock implementation
        console.log("Mock signer signMessage:", message);
        return "0x";
      },
      signTransaction: async (transaction: any) => {
        // Mock implementation
        console.log("Mock signer signTransaction:", transaction);
        return "0x";
      },
    };
  }, [walletClient, address]);

  // Stable refs consumers can reuse
  const ropRef = useRef<typeof ethersReadonlyProvider>(ethersReadonlyProvider);
  const chainIdRef = useRef<number | undefined>(chainId);

  useEffect(() => {
    ropRef.current = ethersReadonlyProvider;
  }, [ethersReadonlyProvider]);

  useEffect(() => {
    chainIdRef.current = chainId;
  }, [chainId]);

  return {
    chainId,
    accounts,
    isConnected,
    ethersProvider,
    ethersReadonlyProvider,
    signer: ethersSigner,
    ethersSigner,
    ropRef,
    chainIdRef,
  } as const;
};
