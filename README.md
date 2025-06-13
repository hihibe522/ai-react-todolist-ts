# React TypeScript 待辦事項清單應用

這是一個使用 React 和 TypeScript 構建的待辦事項清單應用程序，支持 Firebase Authentication 的 Google 第三方登入，使用 Firestore 進行數據存儲，並使用 Tailwind CSS 進行樣式設計，同時集成了 ESLint 和 Prettier 進行代碼質量控制。

## 功能特點

- 使用 Google 帳號登入（Firebase Authentication），同步您的待辦事項
- 將待辦事項存儲在 Firebase Firestore 中（已登入用戶）或 localStorage（未登入用戶）
- 創建、編輯、刪除和標記待辦事項
- 設置待辦事項優先級（低、中、高）
- 過濾顯示所有、未完成或已完成的待辦事項
- 按優先級或字母順序排序待辦事項
- 響應式設計，適用於桌面和移動設備
- 現代化 UI，使用 Tailwind CSS 構建

## 技術棧

- **框架**: React 19 + TypeScript
- **構建工具**: Vite
- **樣式**: Tailwind CSS
- **代碼質量**: ESLint v9 + Prettier
- **認證**: Firebase Authentication
- **數據庫**: Firebase Firestore
- **路由**: React Router v7

## 安裝與設置

1. 克隆代碼庫

   ```bash
   git clone https://github.com/your-username/ai-react-todolist-ts.git
   cd ai-react-todolist-ts
   ```

2. 安裝依賴

   ```bash
   npm install
   ```

3. 配置 Firebase

   - 在 [Firebase 控制台](https://console.firebase.google.com/) 創建一個新項目
   - 添加網頁應用到您的 Firebase 項目
   - 啟用 Authentication 服務並設置 Google 登入方式
   - 創建 Firestore 數據庫
   - 獲取 Firebase 配置信息

4. 設置環境變量

   - 創建 `.env` 文件在專案根目錄，添加以下內容：

   ```
   VITE_FIREBASE_API_KEY=您的Firebase API密鑰
   VITE_FIREBASE_AUTH_DOMAIN=您的Firebase認證域名
   VITE_FIREBASE_PROJECT_ID=您的Firebase項目ID
   VITE_FIREBASE_STORAGE_BUCKET=您的Firebase存儲桶
   VITE_FIREBASE_MESSAGING_SENDER_ID=您的Firebase消息發送者ID
   VITE_FIREBASE_APP_ID=您的Firebase應用ID
   ```

5. 啟動開發伺服器

   ```bash
   npm run dev
   ```

## 部署到 GitHub Pages

1. 安裝 gh-pages 依賴

   ```bash
   npm install --save-dev gh-pages
   ```

2. 在 `package.json` 文件中添加以下內容：

   ```json
   "homepage": "https://your-username.github.io/ai-react-todolist-ts",
   "scripts": {
     // 其他腳本...
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. 修改 Vite 配置以支持子目錄路徑（在 `vite.config.ts` 中）

   ```typescript
   export default defineConfig({
     // 其他配置...
     base: '/ai-react-todolist-ts/', // 添加這行
   });
   ```

4. 若使用 React Router，考慮切換到 HashRouter

   ```tsx
   import { HashRouter as Router } from 'react-router-dom';
   ```

5. 部署應用

   ```bash
   npm run deploy
   ```

## 專案結構

```
src/
├── components/         # 可重用組件
│   ├── Login.tsx       # 登入組件
│   ├── TodoItem.tsx    # 單個待辦事項組件
│   ├── TodoList.tsx    # 待辦事項列表組件
│   └── UserProfile.tsx # 用戶資料組件
├── config/
│   └── firebase.ts     # Firebase 配置
├── contexts/
│   ├── UserContext.tsx         # 用戶上下文
│   └── UserContextProvider.tsx # 用戶上下文提供者
├── pages/
│   ├── DashboardPage.tsx # 儀表板頁面
│   ├── HomePage.tsx      # 首頁
│   └── LoginPage.tsx     # 登入頁面
├── services/
│   └── TodoService.ts    # 待辦事項服務（Firestore 操作）
├── types/
│   ├── TodoItem.ts      # 待辦事項類型定義
│   └── User.ts          # 用戶類型定義
└── App.tsx              # 應用入口
```

## Firebase 相關說明

### Authentication

應用使用 Firebase Authentication 進行用戶認證，支持 Google 登入。在 Firebase 控制台中確保：

1. 啟用 Google 登入方式
2. 添加您的應用域名到授權域名列表中
3. 配置正確的重定向 URI

### Firestore

待辦事項數據存儲在 Firestore 中，每個待辦事項包含以下字段：

- `id`: 待辦事項唯一標識符（自動生成）
- `text`: 待辦事項文本內容
- `completed`: 完成狀態
- `createdAt`: 創建時間
- `priority`: 優先級（'low'、'medium'、'high'）
- `userId`: 用戶 ID

### 安全規則

請確保設置適當的 Firestore 安全規則，例如：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 開發與維護

- 代碼格式化: `npm run format`
- 代碼檢查: `npm run lint`
- 修復代碼問題: `npm run lint:fix`
- 構建生產版本: `npm run build`
- 本地預覽生產版本: `npm run preview`

## 貢獻

歡迎提交 Pull Request 和 Issue 來改進此項目。

## 授權

MIT
