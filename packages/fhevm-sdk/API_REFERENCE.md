# FHEVM SDK API Reference

Complete API reference for the FHEVM SDK.

## Table of Contents

- [Core Module](#core-module)
- [React Module](#react-module)
- [Storage Module](#storage-module)
- [Types](#types)

## Core Module

Import from `@fhevm-sdk/core`

### `createFhevmInstance()`

Creates a new FHEVM instance.

```typescript
function createFhevmInstance(options: {
  provider: string | ethers.Eip1193Provider;
  signal: AbortSignal;
  mockChains?: Record<number, string>;
  onStatusChange?: (status: string) => void;
}): Promise<FhevmInstance>
```

**Parameters:**
- `provider`: Ethereum provider (URL or Eip1193Provider)
- `signal`: AbortSignal for cancellation
- `mockChains`: Optional mock chain configurations
- `onStatusChange`: Optional status change callback

**Returns:** Promise resolving to FhevmInstance

**Example:**
```typescript
const instance = await createFhevmInstance({
  provider: window.ethereum,
  signal: new AbortController().signal,
  onStatusChange: (status) => console.log(status)
});
```

---

## React Module

Import from `@fhevm-sdk/react`

### `useFhevm()`

React hook for managing FHEVM instance lifecycle.

```typescript
function useFhevm(parameters: {
  provider: string | ethers.Eip1193Provider | undefined;
  chainId: number | undefined;
  enabled?: boolean;
  initialMockChains?: Record<number, string>;
}): {
  instance: FhevmInstance | undefined;
  refresh: () => void;
  error: Error | undefined;
  status: FhevmGoState;
}
```

**Parameters:**
- `provider`: Ethereum provider
- `chainId`: Network chain ID
- `enabled`: Whether to initialize (default: true)
- `initialMockChains`: Mock chain configurations

**Returns:**
- `instance`: FhevmInstance or undefined
- `refresh`: Function to reinitialize
- `error`: Error if initialization failed
- `status`: Current state ("idle" | "loading" | "ready" | "error")

**Example:**
```tsx
const { instance, status, error, refresh } = useFhevm({
  provider: window.ethereum,
  chainId: 11155111,
  enabled: true
});

if (status === 'loading') return <Loading />;
if (status === 'error') return <Error error={error} onRetry={refresh} />;
if (status === 'ready') return <App instance={instance} />;
```

### `useFHEEncryption()`

React hook for encrypting data.

```typescript
function useFHEEncryption(params: {
  instance: FhevmInstance | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  contractAddress: `0x${string}` | undefined;
}): {
  canEncrypt: boolean;
  encryptWith: (buildFn: (builder: RelayerEncryptedInput) => void) => Promise<EncryptResult | undefined>;
}
```

**Parameters:**
- `instance`: FHEVM instance from useFhevm
- `ethersSigner`: Ethers signer
- `contractAddress`: Target contract address

**Returns:**
- `canEncrypt`: Boolean indicating if encryption is ready
- `encryptWith`: Function to encrypt data

**Example:**
```tsx
const { canEncrypt, encryptWith } = useFHEEncryption({
  instance,
  ethersSigner: signer,
  contractAddress: '0x...'
});

const encrypt = async () => {
  if (!canEncrypt) return;
  
  const encrypted = await encryptWith((input) => {
    input.add64(100);
    input.addBool(true);
  });
  
  console.log(encrypted.handles);
  console.log(encrypted.inputProof);
};
```

**Encryption Methods:**
- `add8(value: number)` - euint8
- `add16(value: number)` - euint16
- `add32(value: number)` - euint32
- `add64(value: bigint | number)` - euint64
- `add128(value: bigint)` - euint128
- `add256(value: bigint)` - euint256
- `addBool(value: boolean)` - ebool
- `addAddress(value: string)` - eaddress

### `useFHEDecrypt()`

React hook for decrypting FHE data with EIP-712 signing.

```typescript
function useFHEDecrypt(params: {
  instance: FhevmInstance | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  chainId: number | undefined;
  requests: readonly FHEDecryptRequest[] | undefined;
}): {
  canDecrypt: boolean;
  decrypt: () => void;
  isDecrypting: boolean;
  message: string;
  results: Record<string, string | bigint | boolean>;
  error: string | null;
  setMessage: (message: string) => void;
  setError: (error: string | null) => void;
}
```

**Parameters:**
- `instance`: FHEVM instance
- `ethersSigner`: Ethers signer
- `fhevmDecryptionSignatureStorage`: Storage for signatures
- `chainId`: Network chain ID
- `requests`: Array of decryption requests

**Returns:**
- `canDecrypt`: Whether decryption is ready
- `decrypt`: Function to start decryption
- `isDecrypting`: Decryption in progress
- `message`: Status message
- `results`: Decrypted values keyed by handle
- `error`: Error message if any
- `setMessage`: Update message
- `setError`: Update error

**Example:**
```tsx
const { decrypt, results, isDecrypting, error } = useFHEDecrypt({
  instance,
  ethersSigner: signer,
  fhevmDecryptionSignatureStorage: storage,
  chainId: 11155111,
  requests: [
    { handle: '0xhandle1...', contractAddress: '0xcontract...' },
    { handle: '0xhandle2...', contractAddress: '0xcontract...' }
  ]
});

const handleDecrypt = async () => {
  await decrypt();
  console.log(results); // { '0xhandle1...': 42n, '0xhandle2...': true }
};
```

### `useInMemoryStorage()`

React hook providing in-memory storage for development.

```typescript
function useInMemoryStorage(): GenericStringStorage
```

**Returns:** GenericStringStorage instance

**Example:**
```tsx
const storage = useInMemoryStorage();

const { decrypt } = useFHEDecrypt({
  instance,
  ethersSigner,
  fhevmDecryptionSignatureStorage: storage,
  chainId,
  requests
});
```

---

## Storage Module

Import from `@fhevm-sdk/storage`

### `GenericStringStorage`

Generic storage adapter for key-value pairs.

```typescript
class GenericStringStorage {
  constructor(adapter: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
    remove: (key: string) => Promise<void>;
  });
  
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}
```

**Example with localStorage:**
```typescript
const storage = new GenericStringStorage({
  get: async (key) => localStorage.getItem(key),
  set: async (key, value) => localStorage.setItem(key, value),
  remove: async (key) => localStorage.removeItem(key)
});
```

**Example with IndexedDB:**
```typescript
import { openDB } from 'idb';

const db = await openDB('my-app', 1);

const storage = new GenericStringStorage({
  get: async (key) => db.get('keys', key),
  set: async (key, value) => db.put('keys', value, key),
  remove: async (key) => db.delete('keys', key)
});
```

**Example with Redis (Node.js):**
```typescript
import Redis from 'ioredis';

const redis = new Redis();

const storage = new GenericStringStorage({
  get: async (key) => redis.get(key),
  set: async (key, value) => redis.set(key, value),
  remove: async (key) => redis.del(key)
});
```

---

## Types

### `FhevmInstance`

Main FHEVM instance type.

```typescript
interface FhevmInstance {
  createEncryptedInput(
    contractAddress: string,
    userAddress: string
  ): RelayerEncryptedInput;
  
  userDecrypt(
    requests: Array<{ handle: string; contractAddress: string }>,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddresses: string[],
    userAddress: string,
    startTimestamp: number,
    durationDays: number
  ): Promise<Record<string, string | bigint | boolean>>;
  
  publicDecrypt(
    handle: string,
    contractAddress: string
  ): Promise<bigint>;
}
```

### `FhevmGoState`

FHEVM instance state.

```typescript
type FhevmGoState = "idle" | "loading" | "ready" | "error";
```

### `EncryptResult`

Result of encryption operation.

```typescript
interface EncryptResult {
  handles: Uint8Array[];
  inputProof: Uint8Array;
}
```

### `FHEDecryptRequest`

Request for decryption.

```typescript
interface FHEDecryptRequest {
  handle: string;
  contractAddress: `0x${string}`;
}
```

### `RelayerEncryptedInput`

Builder for encrypted inputs.

```typescript
interface RelayerEncryptedInput {
  add8(value: number): this;
  add16(value: number): this;
  add32(value: number): this;
  add64(value: bigint | number): this;
  add128(value: bigint): this;
  add256(value: bigint): this;
  addBool(value: boolean): this;
  addAddress(value: string): this;
  encrypt(): Promise<EncryptResult>;
}
```

---

## Utility Functions

### `getEncryptionMethod()`

Maps ABI internal type to encryption method.

```typescript
function getEncryptionMethod(internalType: string): string
```

**Parameters:**
- `internalType`: ABI internal type (e.g., "externalEuint64")

**Returns:** Encryption method name (e.g., "add64")

**Example:**
```typescript
const method = getEncryptionMethod("externalEuint64"); // "add64"
```

### `toHex()`

Converts Uint8Array or string to hex string.

```typescript
function toHex(value: Uint8Array | string): `0x${string}`
```

**Parameters:**
- `value`: Uint8Array or string

**Returns:** Hex string with "0x" prefix

**Example:**
```typescript
const hex = toHex(new Uint8Array([1, 2, 3])); // "0x010203"
```

### `buildParamsFromAbi()`

Builds contract parameters from encryption result and ABI.

```typescript
function buildParamsFromAbi(
  enc: EncryptResult,
  abi: any[],
  functionName: string
): any[]
```

**Parameters:**
- `enc`: Encryption result
- `abi`: Contract ABI
- `functionName`: Function name

**Returns:** Array of parameters

**Example:**
```typescript
const params = buildParamsFromAbi(encrypted, CONTRACT_ABI, "myFunction");
await contract.myFunction(...params);
```

---

## Error Handling

All async functions may throw errors. Wrap calls in try-catch:

```typescript
try {
  const encrypted = await encryptWith((input) => input.add64(42));
} catch (error) {
  console.error('Encryption failed:', error);
}
```

Common error types:
- **InitializationError**: FHEVM instance creation failed
- **EncryptionError**: Encryption operation failed
- **DecryptionError**: Decryption operation failed
- **SignatureError**: EIP-712 signature creation failed
- **NetworkError**: Network request failed

---

## Best Practices

1. **Always check status before operations**
   ```tsx
   if (status !== 'ready') return;
   ```

2. **Handle errors gracefully**
   ```tsx
   if (error) return <ErrorDisplay error={error} />;
   ```

3. **Use TypeScript for type safety**
   ```typescript
   const result: EncryptResult = await encryptWith(...);
   ```

4. **Store signatures securely**
   ```typescript
   // Use appropriate storage for your environment
   const storage = new GenericStringStorage({ /* secure adapter */ });
   ```

5. **Validate inputs before encryption**
   ```typescript
   if (value < 0 || value > MAX_UINT64) {
     throw new Error('Invalid value');
   }
   ```

6. **Clean up on unmount**
   ```tsx
   useEffect(() => {
     return () => {
       // Cleanup if needed
     };
   }, []);
   ```

---

## Version

Current version: 0.1.0

## License

MIT

## Support

- GitHub: [Repository URL]
- Discord: [Discord URL]
- Documentation: [Docs URL]
