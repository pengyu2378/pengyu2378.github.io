---
title: 今日复盘：从 Hexo 迁移到 VitePress 并修复 GitHub Pages 404
date: 2026-04-18
---

<!-- [[toc]] 是一个特殊的占位符，它代表 Table of Contents（目录）。当你在 Markdown 的正文中输入这行代码时，VitePress 会自动提取当前页面的所有标题，并在该位置生成一个可点击的跳转目录。
[[toc]]
[[toc]]太过丑陋 -->

## 一、今天完成的功能任务

1. **技术路线确定**
   - 决定以 **VitePress** 作为唯一博客框架。
   - 不复用旧 Hexo 主题/壳层，只保留 2025 年日志内容。

2. **博客重建完成（PersonalBlog -> OldPB）**
   - 建立 VitePress 目录结构：`docs/`、`docs/.vitepress/`。
   - 配置站点导航、首页、日志页、关于页。
   - 迁移两篇 2025 日志为 Markdown。

3. **自动部署链路完成（GitHub Pages）**
   - 新增 GitHub Actions 工作流构建并发布 `docs/.vitepress/dist`。
   - 合并 PR 到 `main`，触发自动部署。

4. **问题修复与排障**
   - 处理过安装与构建问题（含 Windows 下安装异常、VitePress 配置格式问题）。
   - 处理一次 Pages 404：通过重新触发 `Deploy VitePress site to Pages` 工作流恢复访问。

5. **仓库整理与清理**
   - 清理不应纳入版本库的构建产物跟踪。
   - 按需求将 `PersonalBlog` 本地未提交改动全部清空，恢复干净状态。

---

## 二、今天所有关键操作（按阶段）

### 阶段 A：框架迁移与内容重建
- 将 Hexo 思路切换为 VitePress 官方结构。
- 仅保留 2025 日志内容，其他旧站结构不再保留。
- 生成新页面：
  - `docs/index.md`
  - `docs/posts/index.md`
  - `docs/about.md`
  - `docs/posts/2025-hello-world.md`
  - `docs/posts/2025-我的第一篇博客文章.md`
- 配置文件：`docs/.vitepress/config.mts`。

### 阶段 B：部署与发布
- 添加工作流：`.github/workflows/deploy.yml`。
- `main` 分支提交后自动构建并发布到 GitHub Pages。

### 阶段 C：404 排查与恢复
- 确认仓库和工作流均为最新。
- 最终通过 **手动 Run workflow（main）** 完成有效发布，页面恢复访问。

### 阶段 D：仓库清理
- 发现“看起来很乱”的状态来自 `PersonalBlog`。
- 按“全部丢弃”执行本地清理，已恢复干净工作区。

---

## 三、今天执行命令与含义（可复用）

> 注：以下是今天迁移/排障中使用的核心命令，按用途整理。

### 1）项目与分支状态检查

```bash
git status
git status --short --branch
git log --oneline -n 8 --decorate
git fetch origin --prune
git log --oneline --decorate --graph --all -n 20
```

- `git status`：查看工作区是否有改动。
- `git status --short --branch`：简洁查看当前分支及跟踪关系。
- `git log --oneline ...`：查看最近提交，确认历史。
- `git fetch origin --prune`：同步远端引用并清理失效远端分支。
- `git log --graph --all`：可视化确认分支/合并关系。

### 2）依赖安装与本地验证

```bash
npm install -D vitepress
npm ci
npm run build
npm run dev
```

- `npm install -D vitepress`：添加 VitePress 开发依赖。
- `npm ci`：按锁文件进行干净、可复现安装（CI 推荐）。
- `npm run build`：构建静态站点产物到 `docs/.vitepress/dist`。
- `npm run dev`：启动本地开发服务预览页面。

### 3）脚本配置

```bash
npm pkg set scripts.dev="vitepress dev docs"
npm pkg set scripts.build="vitepress build docs"
npm pkg set scripts.preview="vitepress preview docs"
```

- `npm pkg set ...`：直接更新 `package.json` 的 scripts，统一开发/构建/预览入口。

### 4）提交与发布

```bash
git add <files>
git commit -m "..."
git push -u origin feat/vitepress-rebuild
```

- `git add <files>`：仅暂存指定文件，避免误提交。
- `git commit -m`：生成一次版本快照。
- `git push -u origin <branch>`：推送分支并建立上游跟踪。

### 5）清理被误跟踪的构建产物

```bash
git rm -r --cached docs/.vitepress/cache docs/.vitepress/dist
```

- `git rm --cached`：仅从 Git 索引移除，不删本地文件；配合 `.gitignore` 阻止后续继续跟踪。

### 6）远端文件核对（排障）

```bash
git show origin/main:docs/.vitepress/config.mts
```

- 查看远端 `main` 指定文件内容，确认线上部署用的实际配置。

### 7）清理本地仓库（已执行在 PersonalBlog）

```bash
git reset --hard HEAD
git clean -fd
```

- `git reset --hard HEAD`：丢弃所有已跟踪文件的未提交改动。
- `git clean -fd`：删除未跟踪文件/目录。
- 两者组合是“全部丢弃本地改动”的最彻底方式（不可恢复）。

---

## 四、今天的最终状态

- `OldPB`：VitePress 博客已可正常访问并可持续发布。
- `PersonalBlog`：本地改动已按要求清空，状态干净。
- 发布方式：以后只需改 `OldPB` 并 push 到 `main`，GitHub Actions 会自动部署。

---

## 五、后续提交到个人博客的标准流程

1. 修改文章或页面（例如 `docs/posts/*.md`）。
2. 本地验证：

```bash
npm run build
npm run dev
```

3. 提交并推送：

```bash
git add docs
git commit -m "docs: 更新博客内容"
git push origin main
```

4. 到 GitHub Actions 确认 `Deploy VitePress site to Pages` 变绿。
5. 访问 `https://pengyu2378.github.io/` 验证线上结果。
