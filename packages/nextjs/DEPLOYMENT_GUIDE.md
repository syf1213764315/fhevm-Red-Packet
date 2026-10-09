# 🚀 Red Packet dApp 部署指南（Netlify）

前端用 **Next.js 15.5.27** + Netlify Next.js runtime。不要使用 15.2.x：Netlify 会因 [CVE-2025-55182](https://ntl.fyi/cve-2025-55182) 拒绝部署。

仓库根目录 `netlify.toml`：

- Build command: `pnpm sdk:build && pnpm next:build`
- Publish directory: `packages/nextjs/.next`
- Node: 20

## 📋 GitHub 持续部署

1. 将代码推送到 GitHub
2. 打开 [app.netlify.com](https://app.netlify.com)
3. **Add new site → Import an existing project**（或对已有站点 **Trigger deploy**）
4. **Base directory 留空**（必须用仓库根目录，才能读到 pnpm workspace）
5. 确认：
   - **Build command**: `pnpm sdk:build && pnpm next:build`（站点 UI 里的 `pnpm --filter site... run build` 也可以）
   - **Publish directory**: `packages/nextjs/.next`
   - Next.js plugin：`@netlify/plugin-nextjs`（可保持 UI 里已启用的状态）
6. Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/syf1213764315/fhevm-Red-Packet)

## CLI

```bash
# 仓库根目录
npx netlify-cli deploy --build --prod
```

## 环境变量（可选）

在 Netlify：**Site configuration → Environment variables**，并在构建前保存：

```
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_id
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

## 常见问题

**Deploy 400: CVE-2025-55182 / Next.js security vulnerability**

```
原因：Next.js 15.2.5 及更早的 15.2.x 被 Netlify 拦截。
处理：升级到 next@15.5.27 后重新部署本分支。
```

**workspace 依赖 @fhevm-sdk 构建失败**

```
构建命令需要先编译 SDK。
不要把 Base directory 设成 packages/nextjs。
```

**ERR_PNPM_OUTDATED_LOCKFILE**

```
根目录 .npmrc 已设置 frozen-lockfile=false。
也可本地执行：pnpm install --no-frozen-lockfile
```

## 检查清单

- [ ] `pnpm install`（仓库根目录）
- [ ] Next.js 为 15.5.27
- [ ] `pnpm sdk:build && pnpm next:build` 成功
- [ ] 合约地址已写入 `utils/redPacketConfig.ts`

## 相关链接

- **合约地址**: [0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F](https://sepolia.etherscan.io/address/0xA9eFbD651C1a20941c8F6FFEBCeE1eC9AC75782F)
- **Netlify CVE 说明**: https://ntl.fyi/cve-2025-55182
- **Netlify 文档**: https://docs.netlify.com
