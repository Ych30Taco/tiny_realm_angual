# TinyRealm Angular 前端專案文件

## 專案概覽

TinyRealm 的管理後台前端，使用 Angular 20 撰寫。提供玩家管理、資源/建築/士兵類型設定、地形地圖操作、AI 測試等功能介面，透過 REST API 與後端服務（`localhost:1026`）溝通。

---

## 技術棧

| 項目 | 版本 |
|------|------|
| Angular | 20.1.6（Standalone Components） |
| TypeScript | 5.8.2 |
| RxJS | 7.8.x |
| Bootstrap | 5.1.3（CDN） |
| FontAwesome | 6.0.0（CDN） |
| 測試框架 | Karma + Jasmine |

---

## 目錄結構

```
src/
├── main.ts                   # 應用啟動點
├── index.html                # 根 HTML
├── styles.css                # 全域樣式（空，主樣式在 app.css）
└── app/
    ├── app.ts                # 根元件
    ├── app.html              # 導航列 + RouterOutlet
    ├── app.css               # 全域卡片、按鈕、導航樣式（紫色主題 #6c63ff）
    ├── app.routes.ts         # 路由設定
    ├── app.config.ts         # 應用設定（providers）
    └── tab/                  # 各功能模組
        ├── main/             # 總覽頁
        ├── player/           # 玩家管理
        ├── resource/         # 資源類型管理
        ├── building/         # 建築類型管理
        ├── soldier/          # 士兵類型管理
        ├── terrain-map/      # 地形地圖操作
        ├── battle/           # 戰鬥管理（開發中）
        ├── data-admin/       # 資料管理（開發中）
        └── aitest/           # AI 聊天測試
```

---

## 路由配置

| 路徑 | 元件 | 說明 |
|------|------|------|
| `/main` | Main | 系統總覽 |
| `/player` | Player | 玩家建立、上下線管理 |
| `/resource` | Resource | 資源類型 CRUD |
| `/building` | Building | 建築類型 CRUD |
| `/soldier` | Soldier | 士兵類型 CRUD |
| `/terrainMap` | TerrainMap | 地圖生成、佔領、戰鬥 |
| `/battle` | Battle | 戰鬥管理（開發中） |
| `/dataAdmin` | DataAdmin | 資料管理（開發中） |
| `/aitest` | Aitest | Gemini AI 聊天介面 |
| `/` | — | 重新導向到 `/main` |

---

## 各模組說明

### Player（玩家管理）
- 建立新玩家、查看玩家列表、切換上線/下線狀態
- 顯示在線玩家、離線玩家、所有遊戲狀態
- HTTP 用戶端：`HttpClient`
- 後端 API：
  - `GET /api/storage/playerList`
  - `GET /api/storage/onlinePlayers` / `offlinePlayers`
  - `GET /api/storage/allGameStateList`
  - `POST /api/player/create`
  - `POST /api/player/login` / `logOut`

### Resource（資源類型管理）
- 資源類型的新增、編輯、刪除
- 管理欄位：id、多語言名稱、描述、圖示 URL、稀有度、可堆疊、分類、排序、基礎生產速率、數量上限等
- HTTP 用戶端：原生 `Fetch API`
- 後端 API：`GET/POST/PUT/DELETE /api/resource/*`

### Building（建築類型管理）
- 建築類型的新增、編輯、刪除
- 建築分類：`function`、`resource`、`military`、`defense`
- 支援等級資料（levels JSON）、允許地形等欄位
- HTTP 用戶端：原生 `Fetch API`
- 後端 API：`GET/POST/PUT/DELETE /api/building/type/*`

### Soldier（士兵類型管理）
- 士兵類型的新增、編輯、刪除
- 士兵類型：`INFANTRY`、`ARCHER`、`CAVALRY`、`SIEGE`、`MAGE`、`DEFENDER`
- 站位：`FRONT`、`MIDDLE`、`BACK`
- HTTP 用戶端：`HttpClient` + `FormBuilder`（ReactiveFormsModule）
- 後端 API：`GET/POST/PUT/DELETE /api/soldier/*`

### TerrainMap（地形地圖）
- 生成隨機預覽地圖（指定大小）、儲存預覽為正式地圖
- 顯示網格地圖（含地形、擁有者、建築、敵人標記）
- 對地格執行：佔領、開始戰鬥
- 地形類型：`plain`、`forest`、`mountain`、`iron_mine`、`stone_mine`、`waterfront`、`river`、`grassland`、`desert`
- HTTP 用戶端：原生 `Fetch API`
- 後端 API：
  - `POST /api/terrain/generatePreview`
  - `GET /api/terrain/savePreview`
  - `GET /api/terrain/gameMap`
  - `POST /api/terrain/occupy`
  - `POST /api/battle/start`
- 服務：`TerrainService`（可注入，封裝地形相關 API）

### Battle（戰鬥管理）
- 目前為空容器，HTML 結構已預留，TypeScript 邏輯尚未實作

### DataAdmin（資料管理）
- 目前為空容器，HTML 結構已預留，TypeScript 邏輯尚未實作

### Aitest（AI 測試）
- 整合 Google Gemini 2.0 Flash Lite API 的聊天介面
- 訊息角色：`user` / `ai`
- **注意**：API Key 目前硬編碼在元件中，上正式環境前須移至環境變數

---

## 啟動與建置

```bash
# 開發伺服器（預設 http://localhost:4200）
npm start

# 生產建置
npm run build

# 監聽模式建置
npm run watch

# 測試
npm test
```

後端服務需同步啟動於 `localhost:1026`。

---

## 已知問題 / 待改進

1. **混用 HTTP 用戶端**：部分元件用 `HttpClient`，部分用 `Fetch API`，建議統一
2. **硬編碼 API Key**：`aitest` 元件的 Gemini API Key 應移到環境變數
3. **空元件**：`Battle`、`DataAdmin` 的 TypeScript 邏輯尚未實作
4. **全域樣式**：`styles.css` 為空，主樣式集中於 `app.css`，需整理分離
