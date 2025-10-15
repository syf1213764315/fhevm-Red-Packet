"use client";

import { useAccount } from "wagmi";

interface NetworkErrorProps {
  error?: string;
  onRetry?: () => void;
}

export const NetworkError = ({ error, onRetry }: NetworkErrorProps) => {
  const { chain, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="alert alert-warning shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h3 className="font-bold">Wallet Not Connected</h3>
          <div className="text-xs">Please connect your wallet to use this feature</div>
        </div>
      </div>
    );
  }

  if (error?.includes("contract not deployed") || error?.includes("not deployed on network")) {
    return (
      <div className="alert alert-error shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="font-bold">{chain?.id === 1 ? "Wrong Network - Mainnet" : "Contract Not Available"}</h3>
          <div className="text-xs">
            {chain?.id === 1 ? (
              <>
                Red Packet dApp is not available on Ethereum Mainnet. Please switch to{" "}
                <strong>Sepolia Testnet (Chain ID: 11155111)</strong> to use this dApp.
                <br />
                <br />
                <strong>How to switch:</strong>
                <br />
                1. Click on your wallet in the browser
                <br />
                2. Go to &quot;Settings&quot; or &quot;Networks&quot;
                <br />
                3. Add Sepolia Testnet if not already added
                <br />
                4. Switch to Sepolia Testnet
              </>
            ) : (
              <>
                Red Packet contract is not deployed on {chain?.name || "this network"}.
                {chain?.id === 31337 && " Please start your local Hardhat node and deploy the contract."}
                {chain?.id === 11155111 && " The contract needs to be deployed on Sepolia testnet."}
                {!chain?.id && " Please connect to Sepolia testnet (Chain ID: 11155111)."}
              </>
            )}
          </div>
          {onRetry && (
            <button onClick={onRetry} className="btn btn-sm btn-outline mt-2">
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="font-bold">Error</h3>
          <div className="text-xs">{error}</div>
          {onRetry && (
            <button onClick={onRetry} className="btn btn-sm btn-outline mt-2">
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};
