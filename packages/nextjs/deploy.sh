#!/bin/bash
set -euo pipefail

echo "🎯 Deploying Red Packet dApp to Netlify..."

if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm is not installed"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if ! command -v netlify &> /dev/null; then
  echo "📦 Installing Netlify CLI..."
  npm i -g netlify-cli
fi

echo "🔐 Logging in to Netlify (opens a browser if needed)..."
netlify login

echo "🚀 Building and deploying production site..."
netlify deploy --build --prod

echo ""
echo "🎉 Deploy complete!"
echo "📖 See DEPLOYMENT_GUIDE.md for Git-based Netlify setup"
echo "🔗 Contract: 0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F (Sepolia)"
