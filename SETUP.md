# Setup Guide

## Quick Setup (< 10 lines)

```bash
git clone <repository-url>
cd fhevm-sdk
pnpm install
cd packages/nextjs
pnpm dev
```

That's it! Open [http://localhost:3000](http://localhost:3000)

## Detailed Setup

### 1. Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Package manager (install with `npm install -g pnpm`)
- **Git**: For cloning the repository
- **MetaMask**: Browser wallet extension

### 2. Clone Repository

```bash
git clone <repository-url>
cd fhevm-sdk
```

### 3. Install Dependencies

The project uses pnpm workspaces to manage multiple packages:

```bash
pnpm install
```

This installs dependencies for:
- FHEVM SDK (`packages/fhevm-sdk`)
- Smart contracts (`packages/hardhat`)
- Next.js dApp (`packages/nextjs`)

### 4. Run Development Server

```bash
cd packages/nextjs
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 5. Connect Wallet

1. Open the app in your browser
2. Click "Connect Wallet" in the top-right corner
3. Select MetaMask (or your preferred wallet)
4. Switch to Sepolia testnet
5. Approve the connection

### 6. Get Test ETH

To use the dApp, you need Sepolia testnet ETH:

1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Request test ETH (0.5 ETH is enough for testing)

### 7. Create Your First Red Packet

1. Click on "Create Red Packet" tab
2. Enter amount (e.g., 0.01 ETH)
3. Set number of packets (e.g., 5)
4. Optionally add a password
5. Set duration (e.g., 24 hours)
6. Click "Create Red Packet"
7. Confirm the transaction in MetaMask
8. Wait for confirmation
9. Share the packet ID with friends!

## Project Structure

```
fhevm-sdk/
├── packages/
│   ├── fhevm-sdk/              # Universal FHEVM SDK
│   │   ├── src/
│   │   │   ├── core/           # Core functionality
│   │   │   ├── react/          # React hooks
│   │   │   ├── storage/        # Storage adapters
│   │   │   └── internal/       # Internal utilities
│   │   ├── test/               # SDK tests
│   │   └── package.json
│   │
│   ├── hardhat/                # Smart contracts
│   │   ├── contracts/
│   │   │   └── RedPacket.sol   # Main contract
│   │   ├── scripts/
│   │   │   └── deploy.ts       # Deployment script
│   │   └── package.json
│   │
│   └── nextjs/                 # Next.js dApp
│       ├── app/                # App router pages
│       │   ├── _components/    # React components
│       │   │   ├── RedPacketDApp.tsx
│       │   │   └── RedPacket/
│       │   │       ├── CreateRedPacket.tsx
│       │   │       ├── ClaimRedPacket.tsx
│       │   │       └── MyRedPackets.tsx
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/         # Shared components
│       ├── hooks/              # Custom hooks
│       ├── utils/              # Utilities
│       │   └── redPacketConfig.ts
│       └── package.json
│
├── README.md                   # Main documentation
├── DEPLOYMENT.md               # Deployment guide
└── pnpm-workspace.yaml         # Workspace configuration
```

## Development Workflow

### Working on the SDK

```bash
cd packages/fhevm-sdk

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build the SDK
pnpm build
```

### Working on Smart Contracts

```bash
cd packages/hardhat

# Compile contracts
pnpm compile

# Run tests
pnpm test

# Deploy to Sepolia
pnpm deploy
```

### Working on the dApp

```bash
cd packages/nextjs

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Setup

### Sepolia Testnet Configuration

The dApp is pre-configured for Sepolia testnet:

- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/59723a3bf359443abd01f46ffc94ceb7
- **Block Explorer**: https://sepolia.etherscan.io

### MetaMask Setup

1. Open MetaMask
2. Click on the network dropdown
3. Click "Add network"
4. Select "Sepolia Test Network"
5. Switch to Sepolia

Or add manually:
- **Network Name**: Sepolia
- **RPC URL**: https://sepolia.infura.io/v3/59723a3bf359443abd01f46ffc94ceb7
- **Chain ID**: 11155111
- **Currency Symbol**: ETH
- **Block Explorer**: https://sepolia.etherscan.io

## Testing

### Test the SDK

```bash
cd packages/fhevm-sdk
pnpm test
```

### Test Smart Contracts

```bash
cd packages/hardhat
pnpm test
```

### Manual Testing

1. **Create Red Packet**
   - Create a public red packet
   - Create a password-protected red packet
   - Try different amounts and packet counts
   - Test expiration times

2. **Claim Red Packet**
   - Claim your own red packet
   - Claim someone else's public red packet
   - Try claiming with wrong password
   - Try claiming twice
   - Try claiming expired packet

3. **My Red Packets**
   - View created packets
   - Check statistics
   - Refund expired packet
   - Try refunding active packet

## Troubleshooting

### pnpm command not found
```bash
npm install -g pnpm
```

### Wrong network error
- Switch to Sepolia testnet in MetaMask
- Check that the RPC URL is correct

### Transaction failing
- Check you have enough Sepolia ETH
- Check gas settings in MetaMask
- View transaction on Etherscan for details

### Contract not found
- Verify the contract address in `utils/redPacketConfig.ts`
- Check that the contract is deployed on Sepolia

### Module not found errors
```bash
# From root directory
pnpm install
```

### Build errors
```bash
# Clean and reinstall
rm -rf node_modules
rm -rf packages/*/node_modules
pnpm install
```

## Tips for Development

1. **Use the React DevTools** to inspect component state
2. **Check browser console** for errors and logs
3. **Use Etherscan** to verify transactions
4. **Test with small amounts** first
5. **Keep backups** of important data

## Next Steps

- Read the [README.md](README.md) for project overview
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Explore the [SDK documentation](packages/fhevm-sdk/README.md)
- Join our Discord for support

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

---

**Happy coding! 🚀**
