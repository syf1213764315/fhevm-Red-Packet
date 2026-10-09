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

## Step 5: Deploy to Netlify

The frontend is a Next.js App Router dApp that **static-exports** on Netlify (`packages/nextjs/out`). Root `netlify.toml` already has the build command, publish directory, and Node 20 settings.

### Option 1: Deploy from GitHub (recommended)

1. Push your code to GitHub
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click **Add new site → Import an existing project**
4. Select this repository
5. Leave **Base directory** empty (repository root)
6. Confirm:
   - **Build command**: `pnpm sdk:build && pnpm next:build`
   - **Publish directory**: `packages/nextjs/out`
7. Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/syf1213764315/fhevm-Red-Packet)

### Option 2: Deploy with Netlify CLI

```bash
cd packages/nextjs
chmod +x netlify-deploy.sh
./netlify-deploy.sh
```

Or:

```bash
cd packages/nextjs
NETLIFY=true pnpm build
npx netlify-cli deploy --prod --dir=out
```

## Environment Variables

No environment variables are required for a basic frontend deploy. The contract address is hardcoded in the config file.

Optional Netlify site environment variables (set them **before** the production build so `NEXT_PUBLIC_*` values are inlined):

```
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_INFURA_PROJECT_ID=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

Netlify also provides `URL` / `DEPLOY_PRIME_URL` automatically for metadata.

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
