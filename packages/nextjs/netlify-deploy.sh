#!/bin/bash
set -euo pipefail

echo "🚀 Deploying Red Packet dApp to Netlify..."

if [ ! -f "package.json" ]; then
  echo "❌ Run this script from packages/nextjs"
  exit 1
fi

if ! command -v netlify &> /dev/null; then
  echo "📦 Installing Netlify CLI..."
  npm install -g netlify-cli
fi

echo "🔧 Building static site..."
NETLIFY=true pnpm build

echo "🌐 Deploying production site from ./out ..."
netlify deploy --prod --dir=out

echo "✅ Deploy complete."
echo "📋 Optional Netlify environment variables:"
echo "   - NEXT_PUBLIC_ALCHEMY_API_KEY"
echo "   - NEXT_PUBLIC_INFURA_PROJECT_ID"
echo "   - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID"
echo "   - NEXT_PUBLIC_SITE_URL"
