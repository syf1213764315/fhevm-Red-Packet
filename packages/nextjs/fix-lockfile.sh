#!/bin/bash

# 🔧 修复 pnpm 锁文件问题

echo "🔧 修复 pnpm 锁文件问题..."

# 检查是否在正确目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在 packages/nextjs 目录中运行此脚本"
    exit 1
fi

echo "📦 删除现有锁文件..."
rm -f pnpm-lock.yaml
rm -rf node_modules

echo "🔄 重新安装依赖..."
pnpm install --no-frozen-lockfile

if [ $? -eq 0 ]; then
    echo "✅ 锁文件修复成功！"
    echo "🚀 现在可以重新部署了"
else
    echo "❌ 修复失败，请检查错误信息"
    exit 1
fi
