#!/bin/bash
set -euo pipefail

echo "🎯 Building Red Packet dApp for Netlify..."

if [ ! -f "package.json" ]; then
  echo "❌ Run this script from packages/nextjs"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm is not installed"
  exit 1
fi

echo "🔧 Building static site..."
NETLIFY=true pnpm build

echo "✅ Build succeeded (output: ./out)"

if ! command -v netlify &> /dev/null; then
  echo "📦 Installing Netlify CLI..."
  npm i -g netlify-cli
fi

echo "🔐 Logging in to Netlify (opens a browser if needed)..."
netlify login

echo "🚀 Deploying production site..."
netlify deploy --prod --dir=out

echo ""
echo "🎉 Deploy complete!"
echo "📖 See DEPLOYMENT_GUIDE.md for Git-based Netlify setup"
echo "🔗 Contract: 0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F (Sepolia)"
