# FHEVM SDK Examples

Practical examples showing how to use the FHEVM SDK in different scenarios.

## Table of Contents

- [Quick Start](#quick-start)
- [React Examples](#react-examples)
- [Vue.js Examples](#vuejs-examples)
- [Node.js Examples](#nodejs-examples)
- [Advanced Patterns](#advanced-patterns)

## Quick Start

### Installation

```bash
npm install @fhevm-sdk ethers
```

### Basic Usage (React)

```tsx
import { useFhevm, useFHEEncryption } from '@fhevm-sdk/react';
import { ethers } from 'ethers';

function App() {
  const { instance } = useFhevm({ 
    provider: window.ethereum, 
    chainId: 11155111 
  });
  
  const { encryptWith } = useFHEEncryption({
    instance,
    ethersSigner: signer,
    contractAddress: '0x...'
  });

  const handleEncrypt = async () => {
    const encrypted = await encryptWith((input) => {
      input.add64(42);
    });
    console.log('Encrypted:', encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

## React Examples

### Example 1: Encrypted Counter

```tsx
import { useFhevm, useFHEEncryption, useFHEDecrypt } from '@fhevm-sdk/react';
import { ethers } from 'ethers';
import { useState } from 'react';

const CONTRACT_ADDRESS = '0x...';
const CONTRACT_ABI = [...];

function EncryptedCounter() {
  const [count, setCount] = useState<bigint | null>(null);
  const signer = useEthersSigner();
  
  const { instance, status } = useFhevm({ 
    provider: signer?.provider, 
    chainId: 11155111 
  });
  
  const { encryptWith } = useFHEEncryption({
    instance,
    ethersSigner: signer,
    contractAddress: CONTRACT_ADDRESS
  });

  const [countHandle, setCountHandle] = useState<string>('');

  const { decrypt, results, isDecrypting } = useFHEDecrypt({
    instance,
    ethersSigner: signer,
    fhevmDecryptionSignatureStorage: storage,
    chainId: 11155111,
    requests: countHandle ? [{ 
      handle: countHandle, 
      contractAddress: CONTRACT_ADDRESS 
    }] : []
  });

  const increment = async () => {
    if (!signer) return;
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const encrypted = await encryptWith((input) => input.add64(1));
    
    const tx = await contract.increment(
      '0x' + Buffer.from(encrypted.handles[0]).toString('hex'),
      '0x' + Buffer.from(encrypted.inputProof).toString('hex')
    );
    
    await tx.wait();
    
    // Get the count handle
    const handle = await contract.getCount();
    setCountHandle(handle);
  };

  const revealCount = async () => {
    await decrypt();
    if (results[countHandle]) {
      setCount(results[countHandle] as bigint);
    }
  };

  if (status === 'loading') return <div>Loading FHEVM...</div>;
  if (status === 'error') return <div>Error loading FHEVM</div>;

  return (
    <div>
      <h1>Encrypted Counter</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={revealCount} disabled={!countHandle || isDecrypting}>
        {isDecrypting ? 'Revealing...' : 'Reveal Count'}
      </button>
      {count !== null && <p>Count: {count.toString()}</p>}
    </div>
  );
}
```

### Example 2: Secret Voting

```tsx
import { useFhevm, useFHEEncryption, useFHEDecrypt } from '@fhevm-sdk/react';
import { useState } from 'react';

function SecretVoting() {
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState<{ yes: bigint, no: bigint } | null>(null);
  
  const { instance } = useFhevm({ provider, chainId });
  const { encryptWith } = useFHEEncryption({ instance, ethersSigner, contractAddress });

  const vote = async (choice: boolean) => {
    const encrypted = await encryptWith((input) => input.addBool(choice));
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    await contract.vote(
      '0x' + Buffer.from(encrypted.handles[0]).toString('hex'),
      '0x' + Buffer.from(encrypted.inputProof).toString('hex')
    );
    
    setHasVoted(true);
  };

  const revealResults = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const [yesHandle, noHandle] = await contract.getResults();
    
    const { decrypt, results } = useFHEDecrypt({
      instance,
      ethersSigner,
      fhevmDecryptionSignatureStorage: storage,
      chainId,
      requests: [
        { handle: yesHandle, contractAddress: CONTRACT_ADDRESS },
        { handle: noHandle, contractAddress: CONTRACT_ADDRESS }
      ]
    });
    
    await decrypt();
    setResults({
      yes: results[yesHandle] as bigint,
      no: results[noHandle] as bigint
    });
  };

  return (
    <div>
      <h1>Secret Voting</h1>
      {!hasVoted ? (
        <>
          <button onClick={() => vote(true)}>Vote Yes</button>
          <button onClick={() => vote(false)}>Vote No</button>
        </>
      ) : (
        <p>Vote submitted!</p>
      )}
      <button onClick={revealResults}>Reveal Results</button>
      {results && (
        <div>
          <p>Yes: {results.yes.toString()}</p>
          <p>No: {results.no.toString()}</p>
        </div>
      )}
    </div>
  );
}
```

### Example 3: Encrypted Token Balance

```tsx
function EncryptedToken() {
  const { instance } = useFhevm({ provider, chainId });
  const { encryptWith } = useFHEEncryption({ instance, ethersSigner, contractAddress });
  const [balance, setBalance] = useState<bigint | null>(null);

  const transfer = async (to: string, amount: bigint) => {
    const encrypted = await encryptWith((input) => {
      input.addAddress(to);
      input.add64(amount);
    });
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    await contract.transfer(
      '0x' + Buffer.from(encrypted.handles[0]).toString('hex'),
      '0x' + Buffer.from(encrypted.handles[1]).toString('hex'),
      '0x' + Buffer.from(encrypted.inputProof).toString('hex')
    );
  };

  const checkBalance = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const balanceHandle = await contract.balanceOf(await signer.getAddress());
    
    const { decrypt, results } = useFHEDecrypt({
      instance,
      ethersSigner,
      fhevmDecryptionSignatureStorage: storage,
      chainId,
      requests: [{ handle: balanceHandle, contractAddress: CONTRACT_ADDRESS }]
    });
    
    await decrypt();
    setBalance(results[balanceHandle] as bigint);
  };

  return (
    <div>
      <h1>Encrypted Token</h1>
      <button onClick={checkBalance}>Check Balance</button>
      {balance !== null && <p>Balance: {balance.toString()}</p>}
      <button onClick={() => transfer('0x...', 100n)}>Send 100 tokens</button>
    </div>
  );
}
```

## Vue.js Examples

### Basic Integration

```vue
<template>
  <div>
    <button @click="encrypt">Encrypt Value</button>
    <p v-if="encrypted">Encrypted: {{ encrypted }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createFhevmInstance } from '@fhevm-sdk/core';
import { ethers } from 'ethers';

const instance = ref(null);
const encrypted = ref(null);

onMounted(async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  instance.value = await createFhevmInstance({
    provider: provider,
    signal: new AbortController().signal,
    onStatusChange: (status) => console.log(status)
  });
});

const encrypt = async () => {
  if (!instance.value) return;
  
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();
  
  const input = instance.value.createEncryptedInput(
    CONTRACT_ADDRESS,
    userAddress
  );
  
  input.add64(42);
  const enc = await input.encrypt();
  
  encrypted.value = '0x' + Buffer.from(enc.handles[0]).toString('hex');
};
</script>
```

### Composition API

```typescript
// composables/useFhevm.ts
import { ref, computed } from 'vue';
import { createFhevmInstance } from '@fhevm-sdk/core';
import { ethers } from 'ethers';

export function useFhevm(chainId: number) {
  const instance = ref(null);
  const status = ref('idle');
  const error = ref(null);

  const initialize = async () => {
    status.value = 'loading';
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      instance.value = await createFhevmInstance({
        provider,
        signal: new AbortController().signal,
        onStatusChange: (s) => console.log(s)
      });
      status.value = 'ready';
    } catch (err) {
      error.value = err;
      status.value = 'error';
    }
  };

  const isReady = computed(() => status.value === 'ready');

  return {
    instance,
    status,
    error,
    isReady,
    initialize
  };
}
```

## Node.js Examples

### Backend Encryption

```javascript
const { createFhevmInstance } = require('@fhevm-sdk/core');
const { ethers } = require('ethers');

async function encryptValue() {
  // Connect to provider
  const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/...');
  
  // Create FHEVM instance
  const instance = await createFhevmInstance({
    provider,
    signal: new AbortController().signal,
    onStatusChange: (status) => console.log('Status:', status)
  });

  // Create encrypted input
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const userAddress = wallet.address;
  
  const input = instance.createEncryptedInput(CONTRACT_ADDRESS, userAddress);
  input.add64(100);
  
  const encrypted = await input.encrypt();
  
  console.log('Encrypted handles:', encrypted.handles);
  console.log('Input proof:', encrypted.inputProof);
  
  return encrypted;
}

encryptValue().catch(console.error);
```

### Batch Processing

```javascript
async function processBatch(values) {
  const instance = await createFhevmInstance({ provider });
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  const results = [];
  
  for (const value of values) {
    const input = instance.createEncryptedInput(CONTRACT_ADDRESS, wallet.address);
    input.add64(value);
    const encrypted = await input.encrypt();
    results.push(encrypted);
  }
  
  return results;
}
```

## Advanced Patterns

### Custom Storage Provider

```typescript
import { GenericStringStorage } from '@fhevm-sdk/storage';
import Redis from 'ioredis';

const redis = new Redis();

const redisStorage = new GenericStringStorage({
  get: async (key: string) => {
    return await redis.get(key);
  },
  set: async (key: string, value: string) => {
    await redis.set(key, value);
  },
  remove: async (key: string) => {
    await redis.del(key);
  }
});
```

### Error Handling

```tsx
function RobustEncryption() {
  const { instance, status, error, refresh } = useFhevm({ provider, chainId });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'error') {
    return (
      <div>
        <p>Error: {error?.message}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  return <EncryptionInterface instance={instance} />;
}
```

### Multiple Contract Interactions

```tsx
const contracts = [
  { address: '0x...', name: 'Counter' },
  { address: '0x...', name: 'Voting' },
  { address: '0x...', name: 'Token' }
];

function MultiContractApp() {
  const { instance } = useFhevm({ provider, chainId });
  
  const encryptFor = async (contractAddress: string, value: bigint) => {
    const { encryptWith } = useFHEEncryption({
      instance,
      ethersSigner: signer,
      contractAddress
    });
    
    return await encryptWith((input) => input.add64(value));
  };

  return (
    <div>
      {contracts.map(contract => (
        <ContractCard 
          key={contract.address}
          contract={contract}
          encryptFor={encryptFor}
        />
      ))}
    </div>
  );
}
```

### Testing with Mock

```typescript
import { createFhevmInstance } from '@fhevm-sdk/core';

describe('Encryption Tests', () => {
  it('should encrypt value correctly', async () => {
    const mockProvider = new MockProvider();
    const instance = await createFhevmInstance({
      provider: mockProvider,
      mockChains: { 11155111: 'http://localhost:8545' }
    });

    const input = instance.createEncryptedInput('0x...', '0x...');
    input.add64(42);
    const encrypted = await input.encrypt();

    expect(encrypted.handles).toBeDefined();
    expect(encrypted.inputProof).toBeDefined();
  });
});
```

## Tips & Best Practices

1. **Always check instance status** before encrypting
2. **Handle errors gracefully** with try-catch blocks
3. **Use TypeScript** for better type safety
4. **Store signatures securely** using appropriate storage
5. **Test thoroughly** before deploying to mainnet
6. **Monitor gas costs** for FHE operations
7. **Cache instances** when possible to avoid re-initialization

## Resources

- [Full Documentation](../README.md)
- [API Reference](../API.md)
- [GitHub Repository](https://github.com/...)
- [Discord Community](https://discord.gg/...)
