# 属灵星球前端 · 改进记录与路线图

> 本文由一次代码审计生成：上半部分是**本轮已完成并验证**的改进；下半部分是**建议继续完善的路线图**（按优先级排序）。
> 说明：审计发现代码库其实相当成熟（0 个 TODO/FIXME、无「敬请期待」占位、图片均有 alt）。因此改进以**打磨、性能、无障碍、工程化**为主，而非补未完成的功能。

---

## 一、本轮已完成（已验证）

| # | 改进 | 文件 | 价值 | 验证 |
|---|------|------|------|------|
| 1 | 生产构建移除噪声调试日志（`console.log/info/debug`）与 `debugger`，保留 `warn/error` | `vite.config.js` | 约 144 处调试日志不再泄漏给终端用户，减小体积、更专业 | `node --check` 通过 |
| 2 | `index.html` 全面升级 | `index.html` | 见下 | HTML 解析通过、关键锚点校验 |
| 3 | 无障碍与动效安全 CSS | `src/styles.css`（追加） | 键盘焦点环 + 尊重系统「减弱动态」偏好 + `.sr-only` | 花括号配平校验 |
| 4 | 社交分享卡片图 | `public/og-image.png`（1200×630） | 链接分享时显示品牌卡片而非空白 | 像素统计校验渲染正确 |
| 5 | 工程化配置 | `.editorconfig` / `.prettierrc.json` / `.prettierignore` | 统一多人协作代码风格（贴合现有「无分号+单引号」风格） | JSON 校验通过 |
| 6 | 仓库杂物治理 | `.gitignore`（追加） / `scripts/cleanup-cruft.sh` | 收敛 75 个 Vite/Vitest 临时包与误入文件 | `bash -n` 通过 |
| 7 | 17 处阻塞式 `alert()` 错误弹窗 → 非阻塞全局 Toast（`window.showToast(msg,'error')`，带 `alert` 兜底） | 10 个页面文件 | 统一、非阻塞的错误提示体验 | 每个文件 @babel/parser 校验通过 |

**`index.html` 具体升级点：**
- 新增 SEO `description` 与 `canonical`。
- 新增 Open Graph + Twitter Card（标题/描述/图片/域名 `holiness.uk`）——微信/Twitter/Facebook 分享时显示卡片。
- `viewport-fit=cover`——刘海屏/灵动岛机型正确铺满。
- 渲染前依据 `app-lang` 偏好动态设置 `<html lang>`——利于屏幕阅读器与浏览器翻译。
- **首屏启动占位**（`#boot-splash`，React 挂载后自动替换）——重型 3D 包加载期间不再白屏。
- `<noscript>` 兜底提示（中/英）。
- Service Worker 清理脚本包 `try/catch`——隐私模式下 `localStorage` 抛错不再中断启动。

---

## 二、建议继续完善的路线图（按优先级）

### P1 — 高价值、低风险，建议优先
1. **源码层清理 `console.log`**：已在生产构建剥离，但可进一步在源码中改为统一的 `debug()` 包装或直接删除（约 144 处）。
2. **接入 ESLint + 纳入 CI**：当前 `.github/workflows/ci.yml` 只跑测试与构建，**无 lint**。建议加 `eslint` + `eslint-plugin-react-hooks`（可捕获 Hooks 依赖遗漏、未定义变量等真实 bug），并加一个 lint job。已随附 Prettier 配置可与之协同。
3. **将「减弱动态」偏好接入 3D 场景**：CSS 层已处理；但重型的 Three.js/`@react-three` 场景动画是 JS `requestAnimationFrame` 驱动，需在 JS 中读取 `matchMedia('(prefers-reduced-motion: reduce)')` 后降帧/暂停自转——对晕动症用户与低端机续航是实打实的体验提升。

### P2 — 用户体验一致性
4. **补 Promise 版确认弹窗以替换 `confirm()`**：✅ 本轮已将 17 处 `alert()` 错误提示替换为全局 Toast。剩余 8 处 `confirm()` 因返回布尔值参与流程控制，需先补一个基于 Promise 的确认弹窗组件（复用 GlobalToast 风格）再替换。
5. **PWA「新版本可用」提示**：`sw.js` 更新后引导用户刷新（配合已有 precache 机制），避免用户长期停留在旧 chunk。
6. **空状态 / 错误态 / 加载态审计**：为列表类页面（代祷墙、社区、灵修记录）统一空状态插画与失败重试按钮。

### P3 — 性能与可维护性
7. **拆分 `src/mirrorData.js`（36,629 行，单文件最大）**：若为静态数据，建议拆为按需 JSON 并懒加载，缩短首屏解析与打包时间。
8. **路由级代码分割复核**：项目已有 `lazyWithRetry.js`，可复核百余个页面是否都走懒加载，并做一次打包体积分析（`rollup-plugin-visualizer`）。
9. **清理根目录 75 个 `*.timestamp-*.mjs`**：运行随附的 `scripts/cleanup-cruft.sh`（沙箱挂载无法删除，需本地执行）。

### P4 — 测试与质量
10. **扩充测试覆盖**：现有 15 个测试文件，集中在工具与 store；可为高频交互页面（代祷墙、灵修记录、登录）补组件测试与关键 API 契约测试。

---

## 三、收尾操作（需在本地执行）

```bash
cd ~/Documents/Projects/DoctorPro/bible3dsphere-frontend

# 1) 清理杂物（沙箱无法删除文件，故本地执行）
bash scripts/cleanup-cruft.sh

# 2) 提交本轮改进 + 之前未入库的两个页面文件
git add -A
git add src/ProductizationPage.jsx src/FormationAnalyticsPage.jsx   # 修复上次 Vercel 构建失败
git commit -m "chore: 无障碍/SEO/构建打磨 + 仓库杂物治理"
git push origin main
```

> 注：请勿 `git add` 沙箱临时探测文件 `__cap_test.txt` / `__cap_copy.txt`（已加入 `.gitignore`，清理脚本亦会删除）。
