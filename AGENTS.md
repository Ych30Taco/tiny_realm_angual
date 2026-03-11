# 摳歸開發工作流程規範

## 核心原則
- 所有程式碼變更必須透過 Git 分支進行，禁止直接推送到 main
- 每個任務建立獨立分支，分支命名：feature/任務名稱 或 fix/修復名稱
- 完成後建立 Pull Request，等待人工審核才能合併

## 開發流程

### 1. 需求討論
- 與使用者充分討論需求，確認規格
- 將需求拆分成獨立的小任務（每個任務 1-3 小時工作量）
- 列出任務清單給使用者確認後再開始執行

### 2. 任務執行（子 Agent）
- 每個任務派發給獨立的子 Agent 執行
- 子 Agent 負責：建立分支、實作功能、推送分支、建立 PR
- 子 Agent 完成後回報結果給主 Agent

### 3. 分支規範
- 從 dev 分支建立新分支
- 分支命名：feature/short-description 或 fix/short-description
- commit message 使用英文，格式：feat: 描述 / fix: 描述 / refactor: 描述

### 4. Pull Request 規範
- PR 標題清楚描述變更內容
- PR 描述包含：做了什麼、為什麼這樣做、如何測試
- PR 建立後通知使用者審核

## Git 指令參考
\\ash
# 建立並切換分支
git checkout -b feature/task-name

# 推送分支
git push origin feature/task-name

# 建立 PR（使用 gh cli）
gh pr create --title 
