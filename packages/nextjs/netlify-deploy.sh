#!/bin/bash
set -euo pipefail

echo "🚀 Deploying Red Packet dApp to Netlify..."

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if ! command -v netlify &> /dev/null; then
  echo "📦 Installing Netlify CLI..."
  npm install -g netlify-cli
fi

echo "🌐 Building and deploying from the workspace root..."
netlify deploy --build --prod

echo "✅ Deploy complete."
echo "📋 Optional Netlify environment variables:"
echo "   - NEXT_PUBLIC_ALCHEMY_API_KEY"
echo "   - NEXT_PUBLIC_INFURA_PROJECT_ID"
echo "   - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID"
echo "   - NEXT_PUBLIC_SITE_URL"
