# 部署指南

本项目支持多种静态网站托管平台，包括 GitHub Pages、Vercel、Netlify 等。

## GitHub Pages 部署

### 方法一：使用 GitHub Actions（推荐）

1. **启用 GitHub Pages**
   - 进入仓库的 **Settings → Pages**
   - **Source 必须选择 "GitHub Actions"**（不要选 "Deploy from a branch"，否则会 404）
   - 若选错，站点会部署源码目录而非构建产物，根路径没有 `index.html`，就会出现 "File not found" / "does not contain the requested file"

2. **配置 Secrets（可选）**
   - 进入 Settings → Secrets and variables → Actions，按需添加：
   - `SITE_URL`：站点地址。未设置时默认为 `https://<用户名>.github.io/<仓库名>/`；自定义域名时设为 `https://你的域名/`。
   - `BASE_PATH`：仅在使用自定义域名且站点在根路径时设置，Value 填 `/`。未设置时自动为 `/<仓库名>/`（项目站必须如此，否则会出现 “does not contain the requested file” / 缺 `index.html`）。

3. **推送代码**
   - 将代码推送到 `main` 分支
   - GitHub Actions 会自动构建并部署到 GitHub Pages

4. **访问网站**
   - 部署完成后，访问：**`https://<你的用户名>.github.io/<仓库名>/`**
   - **务必带上仓库名与尾部斜杠**。若访问 `https://<用户名>.github.io/`（用户站根路径），会 404，因为项目站部署在 `/<仓库名>/` 下。

### 方法二：手动部署

1. 本地构建：
   ```bash
   pnpm build
   ```

2. 将 `dist` 目录的内容推送到 `gh-pages` 分支

## Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. Vercel 会自动检测 Astro 项目并完成部署

## Netlify 部署

1. 将代码推送到 GitHub
2. 在 [Netlify](https://www.netlify.com) 导入项目
3. 构建命令：`pnpm build`
4. 发布目录：`dist`

## 环境变量配置

如果需要使用环境变量配置 site URL，可以在以下位置设置：

- **GitHub Actions**: 在仓库的 Secrets 中设置 `SITE_URL`
- **Vercel**: 在项目设置中添加环境变量 `SITE_URL`
- **Netlify**: 在站点设置中添加环境变量 `SITE_URL`

## 自定义域名

如果使用自定义域名：

1. 在 `astro.config.mjs` 中设置 `site` 为你的域名
2. 在托管平台配置域名解析
3. 确保域名以 `/` 结尾（如 `https://example.com/`）

## 常见 404 排查

若出现 **"File not found" / "does not contain the requested file" / "provide an index.html"**：

1. **Pages 来源**：Settings → Pages → Source 是否为 **"GitHub Actions"**？若为 "Deploy from a branch"，请改为 GitHub Actions。
2. **访问地址**：是否访问 **`https://<用户名>.github.io/<仓库名>/`**（含仓库名与尾部 `/`）？不要访问 `https://<用户名>.github.io/`。
3. **`.nojekyll`**：`public/.nojekyll` 会在构建时复制到 `dist`，用于禁用 Jekyll，否则 `_astro` 等目录会被忽略导致白屏/资源 404。确保该文件存在且未被删除。
4. **Actions 日志**：Build 步骤是否通过？若 `dist/index.html` 缺失，需先解决构建问题。

## 注意事项

- GitHub Pages 项目站的 base 自动为 `/<仓库名>/`，无需改仓库名。
- 确保 `trailingSlash` 设置为 `"always"` 以保持 URL 一致性。
- 构建前确保所有依赖都已安装。
