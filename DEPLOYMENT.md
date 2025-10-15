# Deployment Guide

This guide will walk you through deploying the Red Packet dApp to Sepolia testnet.

## Prerequisites

- Node.js 18+ and pnpm installed
- MetaMask or another Web3 wallet
- Sepolia testnet ETH (get from [Sepolia faucet](https://sepoliafaucet.com/))

## Step 1: Clone and Install

```bash
git clone <repository-url>
cd fhevm-sdk
pnpm install
```

## Step 2: Deploy Smart Contract

```bash
cd packages/hardhat
pnpm install
pnpm compile
```

### Deploy to Sepolia

The private key is already configured in `hardhat.config.ts`:

```bash
pnpm deploy
```

This will:
1. Deploy the RedPacket contract to Sepolia
2. Save the deployment info to `deployments/sepolia.json`
3. Display the contract address

**Example output:**
```
Deploying RedPacket contract...
RedPacket deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Deployment info saved to deployments/sepolia.json
```

## Step 3: Update Contract Address

Copy the deployed contract address and update it in:

`packages/nextjs/utils/redPacketConfig.ts`:

```typescript
export const RED_PACKET_ADDRESS = "0xYourDeployedContractAddress";
```

## Step 4: Run the dApp Locally

```bash
cd packages/nextjs
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Deploy to Vercel

### Option 1: Deploy from GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Set the root directory to `packages/nextjs`
6. Deploy!

### Option 2: Deploy with Vercel CLI

```bash
cd packages/nextjs
npx vercel
```

Follow the prompts to deploy.

## Environment Variables

No environment variables are required for the frontend. The contract address is hardcoded in the config file.

For the smart contract deployment, the private key and RPC URL are configured in `hardhat.config.ts`.

## Verification

After deployment, verify your contract on Etherscan:

```bash
cd packages/hardhat
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Testing the dApp

1. Connect your wallet (make sure you're on Sepolia)
2. Get some Sepolia ETH from a faucet
3. Create a red packet:
   - Enter amount (e.g., 0.01 ETH)
   - Set number of packets (e.g., 5)
   - Optionally add a password
   - Set duration (e.g., 24 hours)
4. Share the packet ID with friends!
5. Claim red packets using the packet ID

## Troubleshooting

### "Insufficient funds" error
- Make sure you have enough Sepolia ETH
- Check that you're on the Sepolia network

### "Contract not deployed" error
- Verify the contract address in `redPacketConfig.ts`
- Check that the contract is deployed on Sepolia

### Transaction failing
- Check the contract on Etherscan for error messages
- Make sure the packet hasn't expired
- Verify the password is correct (if password-protected)

## Network Details

- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/59723a3bf359443abd01f46ffc94ceb7
- **Block Explorer**: https://sepolia.etherscan.io/

## Security Notes

⚠️ **IMPORTANT**: The private key in the repository is for demonstration purposes only. 

For production:
1. Never commit private keys to version control
2. Use environment variables for sensitive data
3. Implement proper access controls
4. Audit your smart contracts

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all steps were followed correctly
3. Create an issue on GitHub
4. Join our Discord for help

---

**Happy deploying! 🚀**
