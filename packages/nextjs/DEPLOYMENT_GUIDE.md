# 🚀 Red Packet dApp 部署指南

恭喜！您的 Red Packet dApp 已经成功构建，现在可以部署到生产环境了！

## 📋 部署选项

### 1. **Vercel 部署（推荐）** ⭐

#### 方法 A：通过 Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录登录
vercel login

# 部署
vercel --prod
```

#### 方法 B：通过 GitHub 集成
1. 将代码推送到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com)
3. 点击 "Import Project"
4. 选择您的 GitHub 仓库
5. 配置项目：
   - **Framework Preset**: Next.js
   - **Root Directory**: `packages/nextjs`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

#### 环境变量配置
在 Vercel 项目设置中添加以下环境变量：
```
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_id
```

#### 常见问题解决

**问题 1: `ERR_PNPM_OUTDATED_LOCKFILE` 错误**
```
解决方案：
✅ 已配置 vercel.json 使用 --no-frozen-lockfile 标志
✅ 已创建 .npmrc 文件优化 pnpm 配置
✅ 或者手动更新锁文件：pnpm install --no-frozen-lockfile
```

**问题 2: 构建失败**
```
解决方案：
1. 确保在 packages/nextjs 目录部署
2. 检查环境变量是否正确设置
3. 验证合约地址配置
```

### 2. **Netlify 部署**

#### 方法 A：通过 Netlify CLI
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod --dir=packages/nextjs/.next
```

#### 方法 B：通过 GitHub 集成
1. 访问 [netlify.com](https://netlify.com)
2. 点击 "New site from Git"
3. 选择 GitHub 仓库
4. 配置构建设置：
   - **Base directory**: `packages/nextjs`
   - **Build command**: `pnpm build`
   - **Publish directory**: `packages/nextjs/.next`

### 3. **Railway 部署**

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 部署
railway deploy
```

## 🔧 部署前检查清单

### ✅ 必需配置
- [x] 项目构建成功 (`pnpm build`)
- [x] 合约已部署到 Sepolia 测试网
- [x] 前端配置了正确的合约地址
- [x] 环境变量已设置

### 📝 重要文件
- `packages/nextjs/package.json` - 项目依赖和脚本
- `packages/nextjs/next.config.ts` - Next.js 配置
- `packages/nextjs/utils/redPacketConfig.ts` - 合约配置
- `packages/nextjs/scaffold.config.ts` - 网络配置

## 🌐 部署后配置

### 1. **域名设置**
- Vercel: 自动提供 `your-project.vercel.app`
- Netlify: 自动提供 `your-project.netlify.app`
- Railway: 自动提供 `your-project.railway.app`

### 2. **环境变量**
确保生产环境设置了正确的环境变量：
```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
```

### 3. **网络配置**
应用已配置为：
- **主网络**: Sepolia 测试网 (Chain ID: 11155111)
- **合约地址**: `0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F`
- **RPC**: Infura Sepolia 端点

## 🎯 功能验证

部署完成后，请测试以下功能：

### ✅ 基本功能
- [ ] 钱包连接
- [ ] 网络切换提示
- [ ] 创建红包
- [ ] 领取红包
- [ ] 交易确认

### ✅ 用户体验
- [ ] 响应式设计
- [ ] 加载动画
- [ ] 错误处理
- [ ] 成功提示

## 🔗 相关链接

- **合约地址**: [0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F](https://sepolia.etherscan.io/address/0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F)
- **Sepolia 测试网**: [sepolia.etherscan.io](https://sepolia.etherscan.io)
- **Vercel 文档**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify 文档**: [docs.netlify.com](https://docs.netlify.com)

## 🎉 部署完成

恭喜！您的 Red Packet dApp 现在已经在生产环境中运行了！

### 下一步建议：
1. 测试所有功能确保正常工作
2. 设置自定义域名（可选）
3. 配置监控和日志（可选）
4. 考虑添加更多功能或优化

---

**注意**: 这是一个测试网应用，请确保用户了解他们使用的是 Sepolia 测试网 ETH，而不是主网 ETH。