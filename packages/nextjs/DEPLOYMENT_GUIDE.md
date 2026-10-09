# 🚀 Red Packet dApp 部署指南（Netlify）

前端已改成 **Netlify 静态站点**：生产构建会执行 Next.js `output: "export"`，发布目录为 `packages/nextjs/out`。仓库根目录的 `netlify.toml` 已写好构建设置。

## 📋 Netlify 部署（推荐）

### 方法 A：GitHub 持续部署

1. 将代码推送到 GitHub
2. 打开 [app.netlify.com](https://app.netlify.com)
3. **Add new site → Import an existing project**
4. 选择本仓库
5. **Base directory 留空**（必须用仓库根目录，才能读到 pnpm workspace 和 `pnpm-lock.yaml`）
6. 确认自动读到的设置：
   - **Build command**: `pnpm sdk:build && pnpm next:build`
   - **Publish directory**: `packages/nextjs/out`
   - **Node**: 20（`.nvmrc`）
7. Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/syf1213764315/fhevm-Red-Packet)

### 方法 B：Netlify CLI

```bash
# 在 packages/nextjs 目录
chmod +x netlify-deploy.sh
./netlify-deploy.sh
```

或手动：

```bash
npm i -g netlify-cli
cd packages/nextjs
NETLIFY=true pnpm build
netlify login
netlify deploy --prod --dir=out
```

### 环境变量（可选）

在 Netlify：**Site configuration → Environment variables**，并在构建前保存：

```
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_id
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

### 常见问题

**问题 1: 发布目录找不到 / 打开网站是 404**

```
确认 Publish directory 是 packages/nextjs/out（不是 .next）。
确认 Base directory 为空。
Netlify 构建时会设置 NETLIFY=true，next.config.ts 会开启静态导出。
```

**问题 2: workspace 依赖 @fhevm-sdk 构建失败**

```
构建命令必须先 pnpm sdk:build，再 pnpm next:build。
不要把 Base directory 设成 packages/nextjs。
```

**问题 3: ERR_PNPM_OUTDATED_LOCKFILE**

```
根目录 .npmrc 已设置 frozen-lockfile=false。
也可本地执行：pnpm install --no-frozen-lockfile
```

## 🔧 部署前检查清单

- [ ] 在仓库根目录能执行 `pnpm install`
- [ ] `pnpm sdk:build` 成功
- [ ] `NETLIFY=true pnpm next:build` 生成 `packages/nextjs/out`
- [ ] 合约已部署到 Sepolia，地址已写入 `utils/redPacketConfig.ts`

### 📝 重要文件

- `netlify.toml`（仓库根目录）- Netlify 构建与发布配置
- `packages/nextjs/package.json` - 前端依赖和脚本
- `packages/nextjs/next.config.ts` - Netlify / IPFS 静态导出
- `packages/nextjs/utils/redPacketConfig.ts` - 合约配置
- `packages/nextjs/scaffold.config.ts` - 网络配置

## 🌐 部署后

- Netlify 会提供 `your-site.netlify.app`
- 主网络: Sepolia（Chain ID: 11155111）
- 合约: `0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F`

### ✅ 功能验证

- [ ] 钱包连接
- [ ] 网络切换提示
- [ ] 创建红包
- [ ] 领取红包
- [ ] 交易确认

## 🔗 相关链接

- **合约地址**: [0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F](https://sepolia.etherscan.io/address/0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F)
- **Sepolia 测试网**: [sepolia.etherscan.io](https://sepolia.etherscan.io)
- **Netlify 文档**: [docs.netlify.com](https://docs.netlify.com)

---

**注意**: 这是测试网应用，请确保用户了解他们使用的是 Sepolia 测试网 ETH。
