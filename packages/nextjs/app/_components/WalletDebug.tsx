"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const WalletDebug = () => {
  const {} = useAccount();
  // const { connect, connectors, error, isPending } = useConnect();
  // const { disconnect } = useDisconnect();
  // const [debugInfo, setDebugInfo] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // const logDebugInfo = () => {
  //   const info = {
  //     isConnected,
  //     address,
  //     chainId: chain?.id,
  //     chainName: chain?.name,
  //     connectors: connectors.map(c => ({
  //       id: c.id,
  //       name: c.name,
  //       ready: c.type,
  //     })),
  //     error: error?.message,
  //   };

  //   setDebugInfo(JSON.stringify(info, null, 2));
  //   console.log("Wallet Debug Info:", info);
  // };

  // return (
  // <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-8">
  //   <h3 className="text-xl font-bold mb-4">Wallet Debug Info</h3>

  //   <div className="space-y-4">
  //     <div>
  //       <strong>Connection Status:</strong> {isConnected ? "Connected" : "Not Connected"}
  //     </div>
  //     {address && (
  //       <div>
  //         <strong>Address:</strong> {address}
  //       </div>
  //     )}
  //     {chain && (
  //       <div>
  //         <strong>Chain:</strong> {chain.name} (ID: {chain.id})
  //       </div>
  //     )}

  //     <div>
  //       <strong>Available Connectors:</strong>
  //       <ul className="ml-4 mt-2">
  //         {connectors.map((connector, index) => (
  //           <li key={`${connector.id}-${index}`} className="mb-2">
  //             <button
  //               onClick={() => connect({ connector })}
  //               disabled={isPending}
  //               className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
  //             >
  //               Connect {connector.name}
  //             </button>
  //             <span className="text-sm text-gray-600">
  //               ID: {connector.id} | Ready: {connector.type}
  //             </span>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>

  //     {error && (
  //       <div className="text-red-600">
  //         <strong>Error:</strong> {error.message}
  //       </div>
  //     )}

  //     <div className="flex gap-2">
  //       <button
  //         onClick={logDebugInfo}
  //         className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
  //       >
  //         Log Debug Info
  //       </button>

  //       {isConnected && (
  //         <button
  //           onClick={() => disconnect()}
  //           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
  //         >
  //           Disconnect
  //         </button>
  //       )}
  //     </div>

  //     {debugInfo && (
  //       <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded">
  //         <pre className="text-xs overflow-auto">{debugInfo}</pre>
  //       </div>
  //     )}
  //   </div>
  // </div>
  // );
};
