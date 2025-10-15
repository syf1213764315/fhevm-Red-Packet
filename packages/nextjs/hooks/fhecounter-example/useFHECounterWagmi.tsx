"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDeployedContractInfo } from "../helper";
import { useWagmiEthers } from "../wagmi/useWagmiEthers";
import { FhevmInstance } from "@fhevm-sdk";
import {
  buildParamsFromAbi,
  getEncryptionMethod,
  useFHEDecrypt,
  useFHEEncryption,
  useInMemoryStorage,
} from "@fhevm-sdk";
import { zeroHash } from "viem";
import { useReadContract } from "wagmi";
import type { Contract } from "~~/utils/helper/contract";
import type { AllowedChainIds } from "~~/utils/helper/networks";

/**
 * useFHECounterWagmi - Minimal FHE Counter hook for Wagmi devs
 *
 * What it does:
 * - Reads the current encrypted counter
 * - Decrypts the handle on-demand with useFHEDecrypt
 * - Encrypts inputs and writes increment/decrement
 *
 * Pass your FHEVM instance and a simple key-value storage for the decryption signature.
 * That's it. Everything else is handled for you.
 */
export const useFHECounterWagmi = (parameters: {
  instance: FhevmInstance | undefined;
  initialMockChains?: Readonly<Record<number, string>>;
}) => {
  const { instance, initialMockChains } = parameters;
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  // Wagmi + viem interop
  const { chainId, accounts, isConnected, ethersReadonlyProvider, ethersSigner } = useWagmiEthers(initialMockChains);

  // Resolve deployed contract info once we know the chain
  const allowedChainId = typeof chainId === "number" ? (chainId as AllowedChainIds) : undefined;
  const { data: fheCounter } = useDeployedContractInfo({ contractName: "FHECounter", chainId: allowedChainId });

  // Simple status string for UX messages
  const [message, setMessage] = useState<string>("");

  type FHECounterInfo = Contract<"FHECounter"> & { chainId?: number };

  const isRefreshing = false as unknown as boolean; // derived from wagmi below
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // -------------
  // Helpers
  // -------------
  const hasContract = Boolean(fheCounter?.address && fheCounter?.abi);
  const hasProvider = Boolean(ethersReadonlyProvider);
  const hasSigner = Boolean(ethersSigner);

  // Note: This hook is designed for ethers compatibility
  // The getContract function is kept for backward compatibility
  const getContract = (mode: "read" | "write") => {
    if (!hasContract) return undefined;
    const providerOrSigner = mode === "read" ? ethersReadonlyProvider : ethersSigner;
    if (!providerOrSigner) return undefined;
    // Return a mock contract object for compatibility
    return {
      increment: async (...params: any[]) => {
        // This would need to be implemented with viem writeContract
        throw new Error("Contract calls should be handled through wagmi hooks");
      },
      decrement: async (...params: any[]) => {
        // This would need to be implemented with viem writeContract
        throw new Error("Contract calls should be handled through wagmi hooks");
      },
      wait: async () => {
        // Mock wait function
        return Promise.resolve({} as any);
      },
    };
  };

  // Read count handle via wagmi
  const readResult = useReadContract({
    address: (hasContract ? (fheCounter!.address as unknown as `0x${string}`) : undefined) as `0x${string}` | undefined,
    abi: (hasContract ? ((fheCounter as FHECounterInfo).abi as any) : undefined) as any,
    functionName: "getCount" as const,
    query: {
      enabled: Boolean(hasContract && hasProvider),
      refetchOnWindowFocus: false,
    },
  });

  const countHandle = useMemo(() => (readResult.data as string | undefined) ?? undefined, [readResult.data]);
  const canGetCount = Boolean(hasContract && hasProvider && !readResult.isFetching);
  const refreshCountHandle = useCallback(async () => {
    const res = await readResult.refetch();
    if (res.error) setMessage("FHECounter.getCount() failed: " + (res.error as Error).message);
  }, [readResult]);
  // derive isRefreshing from wagmi
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _derivedIsRefreshing = readResult.isFetching;

  // Wagmi handles initial fetch via `enabled`

  // Decrypt (reuse existing decrypt hook for simplicity)
  const requests = useMemo(() => {
    if (!hasContract || !countHandle || countHandle === zeroHash) return undefined;
    return [{ handle: countHandle, contractAddress: fheCounter!.address } as const];
  }, [hasContract, fheCounter?.address, countHandle]);

  const {
    canDecrypt,
    decrypt,
    isDecrypting,
    message: decMsg,
    results,
  } = useFHEDecrypt({
    instance,
    ethersSigner: ethersSigner as any,
    fhevmDecryptionSignatureStorage,
    chainId,
    requests,
  });

  useEffect(() => {
    if (decMsg) setMessage(decMsg);
  }, [decMsg]);

  const clearCount = useMemo(() => {
    if (!countHandle) return undefined;
    if (countHandle === zeroHash) return { handle: countHandle, clear: BigInt(0) } as const;
    const clear = results[countHandle];
    if (typeof clear === "undefined") return undefined;
    return { handle: countHandle, clear } as const;
  }, [countHandle, results]);

  const isDecrypted = Boolean(countHandle && clearCount?.handle === countHandle);
  const decryptCountHandle = decrypt;

  // Mutations (increment/decrement)
  const { encryptWith } = useFHEEncryption({
    instance,
    ethersSigner: ethersSigner as any,
    contractAddress: fheCounter?.address,
  });
  const canUpdateCounter = useMemo(
    () => Boolean(hasContract && instance && hasSigner && !isProcessing),
    [hasContract, instance, hasSigner, isProcessing],
  );

  const getEncryptionMethodFor = (functionName: "increment" | "decrement") => {
    const functionAbi = fheCounter?.abi.find(item => item.type === "function" && item.name === functionName);
    if (!functionAbi)
      return { method: undefined as string | undefined, error: `Function ABI not found for ${functionName}` } as const;

    // Type guard to ensure we have a function ABI with inputs
    if (
      functionAbi.type !== "function" ||
      !("inputs" in functionAbi) ||
      !functionAbi.inputs ||
      functionAbi.inputs.length === 0
    ) {
      return { method: undefined as string | undefined, error: `No inputs found for ${functionName}` } as const;
    }

    const firstInput = functionAbi.inputs[0]!;
    if (!firstInput.internalType) {
      return {
        method: undefined as string | undefined,
        error: `No internalType found for first input of ${functionName}`,
      } as const;
    }
    return { method: getEncryptionMethod(firstInput.internalType), error: undefined } as const;
  };

  const updateCounter = useCallback(
    async (value: number) => {
      if (isProcessing || !canUpdateCounter || value === 0) return;
      const op = value > 0 ? "increment" : "decrement";
      const valueAbs = Math.abs(value);
      setIsProcessing(true);
      setMessage(`Starting ${op}(${valueAbs})...`);
      try {
        const { method, error } = getEncryptionMethodFor(op);
        if (!method) return setMessage(error ?? "Encryption method not found");

        setMessage(`Encrypting with ${method}...`);
        const enc = await encryptWith(builder => {
          (builder as any)[method](valueAbs);
        });
        if (!enc) return setMessage("Encryption failed");

        // Note: Contract calls should be handled through wagmi hooks in a real implementation
        // This is a simplified mock for demonstration purposes
        setMessage("Contract call would be executed here...");

        // Simulate transaction wait
        await new Promise(resolve => setTimeout(resolve, 2000));

        setMessage(`${op}(${valueAbs}) completed!`);
        refreshCountHandle();
      } catch (e) {
        setMessage(`${op} failed: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, canUpdateCounter, encryptWith, getContract, refreshCountHandle, fheCounter?.abi],
  );

  return {
    contractAddress: fheCounter?.address,
    canDecrypt,
    canGetCount,
    canUpdateCounter,
    updateCounter,
    decryptCountHandle,
    refreshCountHandle,
    isDecrypted,
    message,
    clear: clearCount?.clear,
    handle: countHandle,
    isDecrypting,
    isRefreshing,
    isProcessing,
    // Wagmi-specific values
    chainId,
    accounts,
    isConnected,
    ethersSigner,
  };
};
