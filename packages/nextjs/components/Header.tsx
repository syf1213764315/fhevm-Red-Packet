"use client";

import React, { useRef } from "react";
import { RainbowKitCustomConnectButton } from "~~/components/helper";
import { useOutsideClick } from "~~/hooks/helper";

/**
 * Site header
 */
export const Header = () => {
  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar min-h-0 shrink-0 justify-between z-20 px-0 sm:px-2">
      <div className="navbar-start">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🧧</span>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Red Packet
            </span>
            <span className="text-xs text-base-content/60">Powered by FHEVM SDK</span>
          </div>
        </div>
      </div>
      <div className="navbar-end grow mr-4">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
