# FHEVM SDK

A universal, modular SDK for building dApps with Fully Homomorphic Encryption (FHE) on the FHEVM blockchain.

## Features

- 🔐 **Encrypted Inputs**: Easy-to-use utilities for creating encrypted inputs
- 🔓 **Decryption Flows**: Support for both user decrypt (EIP-712 signing) and public decrypt
- ⚛️ **React Hooks**: Wagmi-like modular API structure with React hooks
- 🧩 **Framework Agnostic Core**: Core functionality independent of any UI framework
- 📦 **Modular Architecture**: Import only what you need
- 🔄 **Storage Adapters**: Built-in storage solutions for managing encryption keys

## Installation

```bash
npm install @fhevm-sdk
# or
pnpm add @fhevm-sdk
# or
yarn add @fhevm-sdk
```

## Quick Start

### React Integration (< 10 lines)

```tsx
import { useFhevm, useFHEEncryption } from '@fhevm-sdk/react';
import { useEthersSigner } from './hooks/useEthersSigner';

function MyComponent() {
  const signer = useEthersSigner();
  const { instance, status } = useFhevm({ 
    provider: signer?.provider, 
    chainId: 11155111 
  });
  
  const { encryptWith } = useFHEEncryption({
    instance,
    ethersSigner: signer,
    contractAddress: '0x...'
  });

  // Start using FHE!
  const handleEncrypt = async () => {
    const encrypted = await encryptWith((input) => {
      input.add64(42);
    });
  };
}
```

## Architecture

The SDK is divided into several modules for maximum flexibility:

### Core Module (`@fhevm-sdk/core`)

The core module provides framework-agnostic utilities:

```typescript
import { createFhevmInstance } from '@fhevm-sdk/core';

const instance = await createFhevmInstance({
  provider: provider,
  mockChains: {},
  signal: new AbortController().signal,
  onStatusChange: (status) => console.log(status)
});
```

### React Module (`@fhevm-sdk/react`)

React hooks for FHE operations:

#### `useFhevm`
Initialize the FHEVM instance:

```tsx
const { instance, status, error, refresh } = useFhevm({
  provider: provider,
  chainId: 11155111,
  enabled: true
});
```

#### `useFHEEncryption`
Encrypt data for smart contracts:

```tsx
const { canEncrypt, encryptWith } = useFHEEncryption({
  instance,
  ethersSigner,
  contractAddress
});

const encrypted = await encryptWith((input) => {
  input.add64(100);      // euint64
  input.add32(50);       // euint32
  input.addBool(true);   // ebool
});
```

#### `useFHEDecrypt`
Decrypt FHE data with EIP-712 signing:

```tsx
const { canDecrypt, decrypt, isDecrypting, results } = useFHEDecrypt({
  instance,
  ethersSigner,
  fhevmDecryptionSignatureStorage,
  chainId,
  requests: [
    { handle: '0x...', contractAddress: '0x...' }
  ]
});

await decrypt();
console.log(results); // { '0x...': 42n }
```

### Storage Module (`@fhevm-sdk/storage`)

Storage adapters for managing encryption keys:

```typescript
import { GenericStringStorage } from '@fhevm-sdk/storage';

const storage = new GenericStringStorage({
  get: async (key) => localStorage.getItem(key),
  set: async (key, value) => localStorage.setItem(key, value),
  remove: async (key) => localStorage.removeItem(key)
});
```

## Advanced Usage

### Encryption with Multiple Types

```typescript
const encrypted = await encryptWith((input) => {
  input.add8(255);           // euint8
  input.add16(65535);        // euint16
  input.add32(123456);       // euint32
  input.add64(999999n);      // euint64
  input.add128(BigInt(1e18)); // euint128
  input.addBool(true);       // ebool
  input.addAddress('0x...');  // eaddress
});
```

### Decryption with Multiple Handles

```typescript
const requests = [
  { handle: '0xhandle1...', contractAddress: '0xcontract...' },
  { handle: '0xhandle2...', contractAddress: '0xcontract...' }
];

const { results } = useFHEDecrypt({
  instance,
  ethersSigner,
  fhevmDecryptionSignatureStorage,
  chainId,
  requests
});
```

### Custom Storage Provider

```typescript
import { GenericStringStorage } from '@fhevm-sdk/storage';
import { openDB } from 'idb';

const db = await openDB('my-app', 1);

const customStorage = new GenericStringStorage({
  get: async (key) => db.get('keys', key),
  set: async (key, value) => db.put('keys', value, key),
  remove: async (key) => db.delete('keys', key)
});
```

## API Reference

### Types

```typescript
// Encryption result
interface EncryptResult {
  handles: Uint8Array[];
  inputProof: Uint8Array;
}

// FHEVM instance state
type FhevmGoState = "idle" | "loading" | "ready" | "error";

// Decryption request
interface FHEDecryptRequest {
  handle: string;
  contractAddress: `0x${string}`;
}
```

### Utility Functions

```typescript
// Convert encryption method from ABI type
getEncryptionMethod(internalType: string): string;

// Convert to hex string
toHex(value: Uint8Array | string): `0x${string}`;

// Build params from encrypted result and ABI
buildParamsFromAbi(enc: EncryptResult, abi: any[], functionName: string): any[];
```

## Examples

### Basic Counter dApp

```tsx
import { useFhevm, useFHEEncryption } from '@fhevm-sdk/react';
import { ethers } from 'ethers';

function Counter() {
  const signer = useEthersSigner();
  const { instance } = useFhevm({ 
    provider: signer?.provider, 
    chainId: 11155111 
  });
  
  const { encryptWith } = useFHEEncryption({
    instance,
    ethersSigner: signer,
    contractAddress: CONTRACT_ADDRESS
  });

  const increment = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const encrypted = await encryptWith((input) => input.add64(1));
    
    await contract.increment(
      toHex(encrypted.handles[0]),
      toHex(encrypted.inputProof)
    );
  };

  return <button onClick={increment}>Increment</button>;
}
```

### Secret Voting dApp

```tsx
import { useFhevm, useFHEEncryption, useFHEDecrypt } from '@fhevm-sdk/react';

function Voting() {
  const { instance } = useFhevm({ provider, chainId });
  const { encryptWith } = useFHEEncryption({ instance, ethersSigner, contractAddress });
  
  const castVote = async (choice: boolean) => {
    const encrypted = await encryptWith((input) => input.addBool(choice));
    // Submit encrypted vote...
  };

  const { decrypt, results } = useFHEDecrypt({
    instance,
    ethersSigner,
    fhevmDecryptionSignatureStorage,
    chainId,
    requests: [{ handle: voteHandle, contractAddress }]
  });

  return (
    <div>
      <button onClick={() => castVote(true)}>Vote Yes</button>
      <button onClick={() => castVote(false)}>Vote No</button>
      <button onClick={decrypt}>Reveal Results</button>
      {results[voteHandle] && <p>Result: {results[voteHandle]}</p>}
    </div>
  );
}
```

## Framework Support

### Next.js
Fully supported with React hooks. See the example app in `/packages/nextjs`.

### Vue.js
Use the core module directly:

```javascript
import { createFhevmInstance } from '@fhevm-sdk/core';

export default {
  data() {
    return {
      instance: null
    }
  },
  async mounted() {
    this.instance = await createFhevmInstance({
      provider: this.provider,
      // ...
    });
  }
}
```

### Node.js
Use the core module for backend operations:

```javascript
const { createFhevmInstance } = require('@fhevm-sdk/core');
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('...');
const instance = await createFhevmInstance({ provider });
```

## Testing

```bash
pnpm test
```

## Contributing

Contributions are welcome! Please see our contributing guidelines.

## License

MIT

## Links

- [Documentation](https://docs.fhevm.io)
- [GitHub](https://github.com/your-org/fhevm-sdk)
- [Discord](https://discord.gg/fhevm)
