# Red Packet Contract Deployment Instructions

## Issue
The Red Packet contract is not deployed on Sepolia testnet, causing the dApp to show "Contract Not Available" errors.

## Solution

### Option 1: Deploy with Your Own Wallet (Recommended)

1. **Get Sepolia ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/) or [Alchemy Faucet](https://sepoliafaucet.com/)
   - Connect your wallet and request test ETH
   - You'll need at least 0.01 ETH for deployment

2. **Update Hardhat Configuration**
   - Open `packages/hardhat/hardhat.config.ts`
   - Replace the demo private key with your wallet's private key:
   ```typescript
   sepolia: {
     url: "https://sepolia.infura.io/v3/59723a3bf359443abd01f46ffc94ceb7",
     chainId: 11155111,
     accounts: [
       "YOUR_PRIVATE_KEY_HERE" // Replace with your actual private key
     ],
   },
   ```

3. **Deploy the Contract**
   ```bash
   cd packages/hardhat
   pnpm deploy:sepolia
   ```

4. **Update Contract Address**
   - Copy the deployed contract address from the output
   - Update `packages/nextjs/utils/redPacketConfig.ts`:
   ```typescript
   const RED_PACKET_ADDRESSES: Record<number, string> = {
     31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Hardhat local
     11155111: "0xYOUR_DEPLOYED_CONTRACT_ADDRESS", // Replace with actual address
   };
   ```

### Option 2: Use Remix IDE (Alternative)

1. **Open Remix IDE**
   - Go to [remix.ethereum.org](https://remix.ethereum.org)

2. **Create New File**
   - Create `RedPacket.sol` with the contract code from `packages/hardhat/contracts/RedPacket.sol`

3. **Compile and Deploy**
   - Compile the contract (Solidity 0.8.19)
   - Connect your MetaMask wallet (ensure you're on Sepolia)
   - Deploy the contract
   - Copy the deployed address

4. **Update Configuration**
   - Update the contract address in `packages/nextjs/utils/redPacketConfig.ts`

### Option 3: Use Existing Contract (If Available)

If someone has already deployed the contract:
1. Get the contract address from them
2. Update `packages/nextjs/utils/redPacketConfig.ts` with the address
3. Ensure the contract ABI matches the one in the config file

## Network Configuration

Make sure your wallet is configured for Sepolia:
- **Network Name**: Sepolia Test Network
- **RPC URL**: https://sepolia.infura.io/v3/59723a3bf359443abd01f46ffc94ceb7
- **Chain ID**: 11155111
- **Currency Symbol**: ETH
- **Block Explorer**: https://sepolia.etherscan.io

## Verification

After deployment, you can verify the contract on Etherscan:
```bash
cd packages/hardhat
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Testing

Once deployed and configured:
1. Connect your wallet to the dApp
2. Ensure you're on Sepolia network
3. Try creating a red packet
4. Test claiming functionality

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit private keys to version control
- Use environment variables for sensitive data in production
- The demo private key in the config is for testing only

## Troubleshooting

### "Insufficient funds" error
- Make sure you have enough Sepolia ETH
- Check that you're on the Sepolia network

### "Contract not deployed" error
- Verify the contract address in `redPacketConfig.ts`
- Check that the contract is deployed on Sepolia

### Transaction failing
- Check gas settings in MetaMask
- View transaction on Etherscan for details
- Make sure the packet hasn't expired
