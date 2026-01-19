<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/12r8ikNRcYMdzeWlpj-iHrLetEGlkEjUO

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. **重要：设置环境变量**
   - 在 Cloudflare Pages 项目设置中，进入 "Settings" > "Environment variables"
   - 添加环境变量：
     - **变量名**: `GEMINI_API_KEY`
     - **值**: 你的 Gemini API Key
   - 确保为 "Production" 环境设置（也可以为 Preview 环境设置）
4. 构建配置：
   - Build command: `npm run build`
   - Build output directory: `dist`
5. 重新部署项目
