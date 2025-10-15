#!/bin/bash

# 🚀 Red Packet dApp 快速部署脚本

echo "🎯 开始部署 Red Packet dApp..."

# 检查是否安装了必要的工具
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 未安装，请先安装 $1"
        exit 1
    fi
}

echo "📋 检查部署环境..."
check_command "pnpm"
check_command "git"

# 确保在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在 packages/nextjs 目录中运行此脚本"
    exit 1
fi

echo "🔧 构建项目..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo "✅ 构建成功！"

echo ""
echo "🎉 部署选项："
echo "1. Vercel (推荐)"
echo "2. Netlify"
echo "3. Railway"
echo ""

read -p "请选择部署平台 (1-3): " choice

case $choice in
    1)
        echo "🚀 部署到 Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 安装 Vercel CLI..."
            npm i -g vercel
        fi
        
        echo "🔐 登录 Vercel..."
        vercel login
        
        echo "🚀 开始部署..."
        vercel --prod
        ;;
    2)
        echo "🚀 部署到 Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "📦 安装 Netlify CLI..."
            npm i -g netlify-cli
        fi
        
        echo "🔐 登录 Netlify..."
        netlify login
        
        echo "🚀 开始部署..."
        netlify deploy --prod --dir=.next
        ;;
    3)
        echo "🚀 部署到 Railway..."
        if ! command -v railway &> /dev/null; then
            echo "📦 安装 Railway CLI..."
            npm i -g @railway/cli
        fi
        
        echo "🔐 登录 Railway..."
        railway login
        
        echo "🚀 开始部署..."
        railway deploy
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署完成！"
echo "📖 查看完整部署指南: DEPLOYMENT_GUIDE.md"
echo "🔗 合约地址: 0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F (Sepolia)"
echo "🌐 网络: Sepolia 测试网 (Chain ID: 11155111)"
