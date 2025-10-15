#!/bin/bash

# 🚀 Vercel 部署脚本 - Red Packet dApp

echo "🚀 开始部署 Red Packet dApp 到 Vercel..."

# 检查是否在正确目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在 packages/nextjs 目录中运行此脚本"
    exit 1
fi

# 检查 Vercel CLI 是否安装
if ! command -v vercel &> /dev/null; then
    echo "📦 安装 Vercel CLI..."
    npm install -g vercel
fi

echo "🔧 配置 Vercel..."
# 设置 Vercel 项目配置
vercel link --yes

echo "🌐 部署到生产环境..."
vercel --prod

echo "✅ 部署完成！"
echo "🔗 您的应用已部署到 Vercel"
echo "📋 请在 Vercel 控制台配置环境变量："
echo "   - NEXT_PUBLIC_ALCHEMY_API_KEY"
echo "   - NEXT_PUBLIC_INFURA_PROJECT_ID"
