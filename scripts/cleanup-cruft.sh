#!/usr/bin/env bash
# 清理仓库杂物：Vite/Vitest 临时配置包、构建日志、误入的临时文件。
# 在你的本地终端运行（沙箱挂载无法删除文件，故由你本地执行）。
#   bash scripts/cleanup-cruft.sh
set -u
cd "$(dirname "$0")/.." || exit 1
echo "→ 仓库根: $(pwd)"

echo "→ 删除 Vite/Vitest 临时配置包 (*.timestamp-*.mjs) ..."
find . -maxdepth 1 -type f -name 'vite.config.js.timestamp-*.mjs'  -delete 2>/dev/null
find . -maxdepth 1 -type f -name 'vitest.config.js.timestamp-*.mjs' -delete 2>/dev/null

echo "→ 删除误入的临时/日志文件 ..."
rm -f __cap_test.txt __cap_copy.txt buildcheck.log 2>/dev/null
rm -f .fuse_hidden* scripts/.fuse_hidden* 2>/dev/null

echo "→ 从 git 追踪中移除杂物文件（保留 gitignore 规则）..."
for f in buildcheck.log src/_bm_dump.mjs src/_permtest.tmp typescript; do
  if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then
    git rm --cached --quiet "$f" && echo "   git rm --cached $f"
  fi
  rm -f "$f" 2>/dev/null
done

echo "✓ 清理完成。请检查 'git status' 后提交："
echo "    git add -A && git commit -m 'chore: 清理仓库杂物 + 无障碍/构建改进'"
