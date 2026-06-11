# AGENTS.md — 2026 World Cup Display Board

## Quick start

```bash
npm install
npm run dev          # Vite dev server on http://localhost:3000
```

## Commands

| Command | What it does | Notes |
|---|---|---|
| `npm run dev` | Vite dev server, port 3000 | Use this for local development |
| `npm run build` | `vite build` → `dist/` | Production build |
| `npm run lint` | `tsc --noEmit` | Type-check only, no ESLint/Prettier |
| `npm run clean` | `rm -rf dist server.js` | Unix-only, won't work on Windows |

**There are no tests, no test runner, no linting beyond `tsc --noEmit`.**

## Architecture

- **Single-file SPA**: `src/App.tsx` (~1300 lines) contains all views. Navigation is `useState`-driven, no routing library.
- **Data layer**: `src/data/worldCupData.ts` — all teams/players are hardcoded static data. No backend API calls in current code.
- **Components**: `src/components/RadarChart.tsx` (SVG radar chart), `src/components/WeChatFrame.tsx` (phone frame wrapper).
- **Styling**: Tailwind CSS 4 via `@tailwindcss/vite` plugin. CSS entry is `src/index.css` containing only `@import "tailwindcss"`.

## Key conventions

- **Tailwind v4**: Uses `@import "tailwindcss"` (not v3's `@tailwind base/components/utilities`). Configured via Vite plugin, no `tailwind.config.js`.
- **Path alias**: `@/*` maps to project root (tsconfig.json + vite.config.ts).
- **Chinese UI**: All user-facing strings are Simplified Chinese. Keep them consistent when adding features.
- **No `.env.local`**: Copy `.env.example` → `.env.local` and set `GEMINI_API_KEY` if using Gemini API features.
- **Images**: Player avatars and team logos use Unsplash URLs with `referrerPolicy="no-referrer"`.
- **Google AI Studio origin**: Scaffolded from AI Studio. `@google/genai` is a dependency but not actively used in current views.

## Gotchas

- `npm run clean` uses `rm -rf` — use `Remove-Item -Recurse -Force dist` on Windows PowerShell.
- The app simulates a WeChat mini-program UI inside `WeChatFrame`. The phone frame, status bar, and capsule button are purely cosmetic.
- `App.tsx` is one large component. If adding features, consider extracting into separate files in `src/components/`.
- No `vite.config.ts` env var `DISABLE_HMR` is set by default; HMR is enabled in normal dev.

---

## 探索过程的思考记录（中文）

### 1. 项目初印象

刚拿到这个仓库时，从根目录结构就能看出这是一个前端项目：
- 有 `package.json`、`tsconfig.json`、`vite.config.ts` — 标准的 Vite + TypeScript 项目
- `index.html` 入口指向 `/src/main.tsx` — React 项目
- `PRD.md` 文件标题写着"2026年世界杯球员数据分析与球队信息展示小程序" — 产品需求文档

### 2. 技术栈确认

读完 `package.json` 后确认：
- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS 4**（通过 `@tailwindcss/vite` 插件）
- **lucide-react** 图标库
- **motion** 动画库（Framer Motion 的新包名）
- **@google/genai** — Google Gemini AI SDK，但实际代码中没看到调用
- **express** 和 **dotenv** — 可能是之前 AI Studio 模板自带的，当前代码未使用

### 3. 开发命令分析

`package.json` 的 scripts：
- `dev`: `vite --port=3000 --host=0.0.0.0` — 开发服务器跑在 3000 端口
- `build`: `vite build` — 标准构建
- `lint`: `tsc --noEmit` — 只做类型检查，没有 ESLint 或 Prettier
- `clean`: `rm -rf dist server.js` — Unix 命令，Windows 上跑不了

**关键发现：没有测试命令，没有格式化命令。**

### 4. 架构分析

读完 `src/` 目录后发现：
- `src/App.tsx` — 一个 1300 行的巨型组件，包含所有视图
- `src/components/RadarChart.tsx` — SVG 雷达图组件
- `src/components/WeChatFrame.tsx` — 模拟微信小程序手机界面的包装组件
- `src/data/worldCupData.ts` — 所有球队和球员的静态数据

**没有路由库** — 导航完全靠 `useState` 管理（`activeTab`、`selectedTeamId`、`selectedPlayerId`）。

### 5. Tailwind CSS 4 的特殊性

`src/index.css` 只有一行：`@import "tailwindcss";`
这是 Tailwind v4 的写法，和 v3 的 `@tailwind base; @tailwind components; @tailwind utilities;` 完全不同。也没有 `tailwind.config.js` 文件，配置全部通过 Vite 插件处理。

### 6. 路径别名

`tsconfig.json` 和 `vite.config.ts` 都配置了 `@/*` 别名指向项目根目录。这意味着代码中 `import xxx from '@/components/xxx'` 实际上是相对于项目根目录的。

### 7. 数据层

`worldCupData.ts` 包含 6 支球队（阿根廷、法国、英格兰、巴西、葡萄牙、日本）和约 20 名球员的完整数据。所有图片都用 Unsplash 占位图，并设置了 `referrerPolicy="no-referrer"`。

### 8. 环境变量

`.env.example` 定义了 `GEMINI_API_KEY` 和 `APP_URL`，但项目中没有 `.env.local` 文件。README 说需要在 `.env.local` 中设置 API Key。

### 9. 微信小程序模拟

`WeChatFrame.tsx` 是一个精心设计的手机模拟器，包含：
- 手机外壳（刘海、边框）
- iOS 状态栏（时间、信号、WiFi、电池）
- 微信小程序导航栏（返回按钮、标题、胶囊按钮）
- 底部 Home 指示条

这些都是纯装饰性的，不影响功能。

### 10. 总结

这个项目的核心特点是：
1. **单文件架构** — 所有逻辑集中在 App.tsx
2. **纯静态数据** — 没有后端 API 调用
3. **微信小程序 UI 模拟** — 不是真正的微信小程序
4. **Tailwind v4** — 和常见教程的 v3 写法不同
5. **无测试、无 lint** — 只有类型检查

这些信息对后续开发这个项目的 agent 来说非常重要，特别是 Tailwind v4 的写法和单文件架构的特点。
