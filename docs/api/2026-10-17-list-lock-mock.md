# 名單上鎖 API：前端串接文件

更新日期：2026-10-17。適用範圍：目前新增的 8 支 **Mock API**。

新增 API 隨後端服務啟動直接註冊，不需要額外開關。這份文件按目前已實作的 request／response 撰寫，可用於表單、設定、回覆列表與解鎖畫面的串接；mock 資料不會保存，尚不能驗收真實解鎖及權限流程。

## 1. 串接前先確認

- Base URL 沿用專案現有的 API 環境設定。下方全部使用相對路徑，不額外加 `/api/v1` 或 `/api/v2`。本文件不代表已部署至特定環境。
- 所有新增端點都需要登入，沿用既有會員 access token，沒有額外的 creator 登入或角色 token。
- 原有 `POST /lists`、`PUT /lists/:id`、`GET /lists/:id` 等 API 保持不變，新舊流程並行。這次只新增下表路由，不要求前端立即切換所有舊流程。
- 既有 `GET /lists/:id` 尚未新增公開預覽、`lock`、`access` 或 `lockToken` 欄位。現階段解鎖串接使用本文件固定名單／方法 ID 與範例 token。
- 新端點回應帶 `X-Poklist-Mock: list-unlock` 與 `Cache-Control: private, no-store`。CORS 已允許 `Idempotency-Key`，並允許前端讀取 `X-Poklist-Mock`。

### Headers

| Header | 使用時機 | 值／規則 |
| --- | --- | --- |
| Authorization | 全部 8 支端點 | `Bearer <access-token>`；使用既有登入取得的有效 token |
| Content-Type | 有 JSON body 時 | `application/json` |
| Idempotency-Key | 全部 POST／PATCH | 非空字串；一次使用者操作使用一個新 key，網路重試沿用原 key |

Mock 目前只檢查 Idempotency-Key 非空，不提供正式的去重或衝突校驗。GET 不需要此 header。已讀 POST 無 body，也不需要 Content-Type。

```http
Authorization: Bearer <access-token>
Content-Type: application/json
Idempotency-Key: <operation-key>
```

請勿把 access token 或使用者輸入的密碼／回答寫入公開文件或 console log。

## 2. 路由總表

| 用途 | Method | 路由 | Body |
| --- | --- | --- | --- |
| 建立名單與瀏覽設定 | POST | /creator/lists | JSON |
| 更新名單與瀏覽設定 | PATCH | /creator/lists/:listId | JSON |
| 取得完整編輯表單與設定 | GET | /creator/lists/:listId | 無 |
| 密碼名額增加 10 人 | POST | /creator/lists/:listId/passwords/:passwordId/increase-capacity | JSON |
| 取得歷史題目 | GET | /creator/lists/:listId/questions | 無；query 分頁 |
| 取得指定題目回答 | GET | /creator/lists/:listId/questions/:questionId/answers | 無；query 分頁 |
| 標記指定題目的回答已讀 | POST | /creator/lists/:listId/questions/:questionId/answers/read | **無** |
| 讀者以密碼或回答解鎖 | POST | /lists/:id/unlock | JSON |

目前沒有 `GET /creator/lists` 集合列表、獨立 questions／passwords 的新增修改刪除、或歷史回答刪除 API。主開關與題目設定合併在建立／更新名單的請求內。

## 3. 共通格式與 enum

### JSON 與 ID

- 名單／密碼／題目／回答 ID 都是 string；會員 `user.id` 沿用 number。
- Path 參數使用 `listId`／`passwordId`／`questionId`；JSON 使用 `listID`／`passwordID`／`questionID`，請按範例保留大小寫。
- 建立／更新名單的 response 使用 `content.id`；取得編輯設定使用 `content.listID`。
- `type` 保持 number；其他本次輸出的 enum 為 string。
- JSON request 不接受 `null` 或未定義欄位；省略不使用的欄位即可。這與 response 可回傳 `null` 不同。
- `password`／`question` 設定物件無資料時回 `null`；列表空值回 `[]`。
- 時間是 RFC3339 UTC 字串，顯示時由前端轉換時區；mock 時間為固定範例。
- 問題／回答字數按 Unicode code point 計算，與 JavaScript 字串 `.length` 的 UTF-16 長度不同；組合 emoji 可能包含多個 code point。

| 欄位 | 型別 | 可用值 | 意義 |
| --- | --- | --- | --- |
| type | number | `1`、`2` | 公開、隱藏；mock 尚未實作真實可見性判斷 |
| lock.method／method | string | `none`、`password`、`question` | 不上鎖、密碼、問答；unlock 請求只接受後兩者 |
| password.status／question.status／歷史題目 status | string | `active`、`inactive` | 方法設定版本啟用／停用；歷史 inactive 題仍可查看回答 |
| capacity.limitMode | string | `limited`、`unlimited` | 有限人數、不限人數 |

`unknown` 僅為後端 enum 預留值，不接受作本次請求輸入。目前名單本身未回傳生命週期 `status`；不要把方法設定的 active／inactive 視為名單是否刪除。

### 回應外層

成功 HTTP status 為 200，JSON 的 `code` 是字串 `"200"`。`message` 為顯示文字，請勿用它判斷流程。單筆資料在 `content`；列表也直接放在 `content`，分頁欄位在最外層：

```json
{
  "code": "200",
  "message": "Success",
  "content": [],
  "offset": 0,
  "limit": 20,
  "totalElements": 0
}
```

### 共用名額欄位

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| limitMode | string | 唯一的限制模式判斷依據 |
| limitCount | number | 總名額；unlimited 時不使用此值，mock 初始化為 0 |
| usedCount | number | 密碼：已占額帳號數；問答：此題不同回答帳號數，不是回答筆數 |
| remainingCount | number 或 null | limited 的剩餘人數可為 0；unlimited 固定 null |
| isFull | boolean | 是否額滿；unlimited 固定 false |

不要以 `limitCount === 0` 或 `remainingCount === 0` 判斷是否不限人數，請使用 `limitMode`。

## 4. 固定測試資料

目前只接受下列 fixture ID；直接使用真實舊名單 ID 呼叫新增端點會找不到 fixture。所有登入會員看到相同的合成資料，不會讀到其他會員的真實設定或回答。

| 名稱 | 值 |
| --- | --- |
| 不上鎖名單 listId | `01K7M8T0H8D5GW9KR4N2P6C3VY` |
| 密碼名單 listId | `01K7M8T0H8D5GW9KR4N2P6C3VZ` |
| 問答名單 listId | `01K7M8T0H8D5GW9KR4N2P6C3W3` |
| 密碼版本 passwordId，屬密碼名單 | `01K7M8T0H8D5GW9KR4N2P6C3W1` |
| active 題目 questionId，屬問答名單 | `01K7M8T0H8D5GW9KR4N2P6C3W0` |
| inactive 舊題 questionId，屬問答名單 | `01K7M8T0H8D5GW9KR4N2P6C3VX` |
| editToken 範例 | `mock-edit-token` |
| lockToken 範例 | `mock-lock-token` |
| 編輯設定顯示的範例密碼 | `mock-password` |

兩種 token 目前只檢查非空；密碼也只檢查非空，不比對正確性。問答名單有 2 題與 3 筆回答，active 題 2 筆、舊題 1 筆；未讀摘要固定為 2。

## 5. 建立名單

```http
POST /creator/lists
```

需要 Authorization、Content-Type 與 Idempotency-Key。

### Request 欄位

| 欄位 | 型別 | 必填 | 規則 |
| --- | --- | --- | --- |
| title | string | 是 | 去首尾空白後不可為空 |
| description | string | 否 | 省略為空字串 |
| coverImage | string | 否 | 省略為空字串；mock 原樣回顯，不上傳圖片 |
| externalLink | string | 否 | 省略為空字串 |
| categoryID | number | 否 | 大於 0；省略預設 1，僅此新增入口採此預設 |
| type | number | 否 | 1／2；省略預設 1 |
| lock | object | 否 | 省略使用 none；不可為 null |
| lock.method | string | lock 有提供時必填 | none／password／question |
| lock.question | string | method=question 時必填 | 去首尾空白後 1～60 個 Unicode code point；其他 method 不可提供 |

建立不接受 `resetReadPermissions`、自訂密碼、名額設定或 ownerID。

問答名單 request：

```json
{
  "lock": {
    "method": "question",
    "question": "你最想去哪裡？"
  },
  "title": "旅行清單"
}
```

密碼名單 request：

```json
{"title":"密碼名單","lock":{"method":"password"}}
```

不上鎖名單 request：

```json
{"title":"公開名單"}
```

問答名單 response：

```json
{
  "code": "200",
  "content": {
    "categoryID": 1,
    "coverImage": "",
    "description": "",
    "editToken": "mock-edit-token",
    "externalLink": "",
    "id": "01K7M8T0H8D5GW9KR4N2P6C3W3",
    "lock": {
      "method": "question"
    },
    "title": "旅行清單",
    "type": 1
  },
  "message": "Success"
}
```

`content.id` 依 method 固定回對應的 fixture ID，不會產生新名單。建立只回 lock.method 摘要；完整題目或系統密碼由下一支編輯設定 GET 取得。

## 6. 取得名單編輯設定

```http
GET /creator/lists/:listId
```

需要 Authorization，無 body。可直接用本節資料初始化編輯表單，並保存 editToken 供 PATCH 使用。

### 密碼名單 response

```json
{
  "code": "200",
  "content": {
    "answerSummary": {
      "totalCount": 0,
      "unreadCount": 0
    },
    "categoryID": 1,
    "coverImage": "",
    "description": "",
    "editToken": "mock-edit-token",
    "externalLink": "",
    "listID": "01K7M8T0H8D5GW9KR4N2P6C3VZ",
    "method": "password",
    "password": {
      "capacity": {
        "isFull": true,
        "limitCount": 10,
        "limitMode": "limited",
        "remainingCount": 0,
        "usedCount": 10
      },
      "id": "01K7M8T0H8D5GW9KR4N2P6C3W1",
      "password": "mock-password",
      "status": "active"
    },
    "question": null,
    "title": "旅行清單",
    "type": 1
  },
  "message": "Success"
}
```

### 問答名單 response

```json
{
  "code": "200",
  "content": {
    "answerSummary": {
      "totalCount": 3,
      "unreadCount": 2
    },
    "categoryID": 1,
    "coverImage": "",
    "description": "",
    "editToken": "mock-edit-token",
    "externalLink": "",
    "listID": "01K7M8T0H8D5GW9KR4N2P6C3W3",
    "method": "question",
    "password": null,
    "question": {
      "capacity": {
        "isFull": false,
        "limitCount": 0,
        "limitMode": "unlimited",
        "remainingCount": null,
        "usedCount": 2
      },
      "createdAt": "2026-10-17T01:30:00Z",
      "id": "01K7M8T0H8D5GW9KR4N2P6C3W0",
      "question": "你最想去哪裡？",
      "status": "active"
    },
    "title": "旅行清單",
    "type": 1
  },
  "message": "Success"
}
```

### 回應欄位

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| listID | string | 本名單 ID |
| title／description／coverImage／externalLink | string | 編輯表單基本資料 |
| categoryID | number | 分類 ID |
| type | number | 可見性 1／2 |
| method | string | 選用解鎖方式，位置在 content.method |
| editToken | string | 後續 PATCH 必填 |
| password | object 或 null | `{id,status,password,capacity}`；只有 creator 設定回應含密碼 |
| question | object 或 null | `{id,status,question,createdAt,capacity}` |
| answerSummary.totalCount | number | 回答筆數，問答 fixture 固定 3 |
| answerSummary.unreadCount | number | 未讀筆數，問答 fixture 固定 2 |

不上鎖 fixture 的 method=none、password=null、question=null、摘要兩個 count 都為 0。這個 GET 與一般閱讀 `GET /lists/:id` 的 DTO 不同，請勿共用會期待相同欄位的解析邏輯。

## 7. 更新名單

```http
PATCH /creator/lists/:listId
```

需要 Authorization、Content-Type 與 Idempotency-Key。主開關、題目與保留／重置選項放在同一次請求，不拆成多支設定寫入 API。

### Request 欄位

| 欄位 | 型別 | 必填 | 省略／提供的語意 |
| --- | --- | --- | --- |
| editToken | string | 是 | 非空，從編輯設定 GET 取得 |
| title | string | 否 | 省略沿用；提供時去首尾空白後不可為空 |
| description／coverImage／externalLink | string | 否 | 省略沿用；空字串清空 |
| categoryID | number | 否 | 省略沿用；提供須大於 0 |
| type | number | 否 | 省略沿用；提供為 1／2 |
| lock | object | 否 | 省略保留方法；不接受 null |
| lock.method | string | lock 有提供時必填 | none／password／question |
| lock.question | string | 見下方 | 去首尾空白後 1～60 個 Unicode code point；只有 question 方法可提供 |
| lock.resetReadPermissions | boolean | lock 有提供時必填 | false 保留資格、true 重置；不可省略或傳 null |

問答 fixture 本來有題目，更新 question 方法時可省略 question。從其他 fixture 切到 question 方法，須提供 question。Mock 會檢查這個輸入組合，但不真的換題或重置資格。

只有改標題時，可以只傳 `title` 與 `editToken`，不必附 lock。停止上鎖時傳 `lock.method="none"` 並附明確的 resetReadPermissions。

停止上鎖並保留資格的 request 範例（密碼名單）：

```json
{
  "description": "",
  "editToken": "mock-edit-token",
  "lock": {
    "method": "none",
    "resetReadPermissions": false
  },
  "title": "更新標題"
}
```

Response：

```json
{
  "code": "200",
  "content": {
    "categoryID": 1,
    "coverImage": "",
    "description": "",
    "editToken": "mock-edit-token",
    "externalLink": "",
    "id": "01K7M8T0H8D5GW9KR4N2P6C3VZ",
    "lock": {
      "method": "none"
    },
    "title": "更新標題",
    "type": 1
  },
  "message": "Success"
}
```

修改題目的 request 範例（問答名單）：

```json
{
  "editToken": "mock-edit-token",
  "lock": {
    "method": "question",
    "question": "下一趟旅行想去哪裡？",
    "resetReadPermissions": false
  }
}
```

建立與更新的成功 response 外形相同，都使用 `id`、`lock.method`、`editToken`，不回密碼。Mock 省略欄位沿用的是固定 fixture 基底，並非上一次 PATCH 的結果；重新 GET 也會回原始固定資料。

## 8. 密碼名額增加 10 人

```http
POST /creator/lists/:listId/passwords/:passwordId/increase-capacity
```

需要 Authorization、Content-Type 與 Idempotency-Key。使用密碼名單 ID 與其 passwordId。

| Request 欄位 | 型別 | 必填 | 規則 |
| --- | --- | --- | --- |
| expectedLimitCount | number | 是 | mock 固定傳 10，其他數字回 400 |

不傳 amount／newLimitCount，不允許任意指定新上限。

Request：

```json
{
  "expectedLimitCount": 10
}
```

Response：

```json
{
  "code": "200",
  "content": {
    "capacity": {
      "isFull": false,
      "limitCount": 20,
      "limitMode": "limited",
      "remainingCount": 10,
      "usedCount": 10
    },
    "listID": "01K7M8T0H8D5GW9KR4N2P6C3VZ",
    "passwordID": "01K7M8T0H8D5GW9KR4N2P6C3W1"
  },
  "message": "Success"
}
```

Mock 每次都回上限 20、用量 10、剩餘 10；不會連續加成 30 或 40。重新 GET 密碼設定仍回上限 10 與額滿狀態。畫面可使用 POST 回應演示加額結果，但不可把它當成已保存。

## 9. 歷史題目列表

```http
GET /creator/lists/:listId/questions?offset=0&limit=1
```

需要 Authorization，無 body。

### 分頁規則（題目與回答列表共用）

| Query | 型別 | 預設 | 規則 |
| --- | --- | --- | --- |
| offset | integer | 0 | ≥0，下一頁以 offset+limit 取得 |
| limit | integer | 20 | 1～100 |

非法數字、空值、負 offset、超出 limit 範圍或重複分頁參數回 400。超出最後一頁回 `content: []`，totalElements 仍保留資料總數。不要傳 page／pageSize，這兩支 API 使用 offset／limit。

問答名單 offset=0、limit=1 的 response：

```json
{
  "code": "200",
  "content": [
    {
      "answerCount": 2,
      "createdAt": "2026-10-17T01:30:00Z",
      "id": "01K7M8T0H8D5GW9KR4N2P6C3W0",
      "question": "你最想去哪裡？",
      "status": "active"
    }
  ],
  "limit": 1,
  "message": "Success",
  "offset": 0,
  "totalElements": 2
}
```

| Item 欄位 | 型別 | 說明 |
| --- | --- | --- |
| id | string | questionId，後續查回答與標已讀使用 |
| status | string | active／inactive；不以 inactive 隱藏歷史 |
| question | string | 題目文字 |
| createdAt | string | 這個版本的建立時間 |
| answerCount | number | 此題回答筆數；不等同設定內 capacity.usedCount |

問答名單 totalElements=2，下一頁 offset=1 可取得 inactive 舊題。不上鎖／密碼 fixture 沒有歷史題目，回空列表。GET 不標記已讀。

## 10. 指定題目的回答列表

```http
GET /creator/lists/:listId/questions/:questionId/answers?offset=1&limit=1
```

需要 Authorization，無 body；分頁規則與上一節相同。問答名單的 active／inactive 題目都可查詢。

active 題目 offset=1、limit=1 的 response：

```json
{
  "code": "200",
  "content": [
    {
      "answer": "我想去台南。",
      "createdAt": "2026-10-17T01:31:00Z",
      "id": "01K7M8T0H8D5GW9KR4N2P6C3W2",
      "user": {
        "displayName": "Traveler",
        "id": 35,
        "isFollowing": false,
        "profileImage": "",
        "userCode": "mock-traveler"
      }
    }
  ],
  "limit": 1,
  "message": "Success",
  "offset": 1,
  "totalElements": 2
}
```

| Item 欄位 | 型別 | 說明 |
| --- | --- | --- |
| id | string | 回答 ID |
| answer | string | 回答文字 |
| createdAt | string | 回答提交時間 |
| user.id | number | 回答者會員 ID |
| user.displayName | string | 顯示名稱 |
| user.userCode | string | 公開帳號代碼 |
| user.profileImage | string | 頭像 URL，無資料為空字串 |
| user.isFollowing | boolean | 創作者是否追蹤此回答者 |

active 題共 2 筆，較新回答排在前面；舊題共 1 筆。回答列表沒有逐筆 isRead 欄位，題目列表也沒有逐題 unreadCount，請勿自行期待這些欄位。GET 不標記已讀。

## 11. 指定題目的回答標已讀

```http
POST /creator/lists/:listId/questions/:questionId/answers/read
Authorization: Bearer <access-token>
Idempotency-Key: <operation-key>
```

**不要附 body**，包含 `{}`、`null` 或空白內容都不應傳送。若使用共用 POST helper，請確認它不會自動補空物件。

Response：

```json
{
  "code": "200",
  "content": {
    "listID": "01K7M8T0H8D5GW9KR4N2P6C3W3",
    "markedAt": "2026-10-17T01:32:00Z",
    "questionID": "01K7M8T0H8D5GW9KR4N2P6C3W0"
  },
  "message": "Success"
}
```

此路由以 questionId 指定範圍。前端實際進入某題回答列表時觸發，再 GET 該題回答；換頁或背景預抓 GET 不應另觸發標記。inactive 舊題也可使用。

正式設計的範圍是該題當下所有分頁，其他題目不受影響、之後新回答仍未讀；目前 mock 只回固定 markedAt，未讀摘要仍為 2，不會隨請求改變，也不能用固定時間驗收未讀計算。

## 12. 讀者解鎖

```http
POST /lists/:id/unlock
```

需要 Authorization、Content-Type 與 Idempotency-Key。讀者解鎖使用一般前台路由，不放在 /creator。

### 密碼方法

使用密碼名單 ID。Request 必填欄位如下：

| 欄位 | 型別 | 規則 |
| --- | --- | --- |
| method | string | 固定 password |
| passwordID | string | 密碼 fixture 版本 ID |
| password | string | 非空白；mock 不驗證正確性 |
| lockToken | string | 非空，現階段可使用 mock-lock-token |

Request：

```json
{
  "lockToken": "mock-lock-token",
  "method": "password",
  "password": "reader-input",
  "passwordID": "01K7M8T0H8D5GW9KR4N2P6C3W1"
}
```

### 問答方法

使用問答名單 ID。Request 必填欄位如下：

| 欄位 | 型別 | 規則 |
| --- | --- | --- |
| method | string | 固定 question |
| questionID | string | active 題目 ID；inactive 舊題不能解鎖 |
| answer | string | 去首尾空白後 1～350 個 Unicode code point |
| lockToken | string | 非空，現階段可使用 mock-lock-token |

Request：

```json
{
  "answer": "京都",
  "lockToken": "mock-lock-token",
  "method": "question",
  "questionID": "01K7M8T0H8D5GW9KR4N2P6C3W0"
}
```

同一請求只能提供所選方法的欄位；不要把 password／passwordID 與 answer／questionID 一起傳，也不要把未使用的一組欄位設為 null。

問答方法 response（密碼方法外形相同，listID 改為密碼名單）：

```json
{
  "code": "200",
  "content": {
    "access": {
      "canViewContent": true,
      "isOwner": false
    },
    "listID": "01K7M8T0H8D5GW9KR4N2P6C3W3"
  },
  "message": "Success"
}
```

Mock 的 access 固定 isOwner=false、canViewContent=true；不保存回答、不占名額、不建立閱讀資格。不能據此認為真實受保護內容已解鎖，也不要把 canViewContent 保存成往後請求的授權憑證。舊 GET 尚未接入新權限流程。

## 13. 錯誤處理

| HTTP | 目前場景 | 前端處理 |
| --- | --- | --- |
| 400 | 缺 Idempotency-Key／必填欄位、null／未知欄位、enum／字數／分頁不合法、解鎖欄位混用或方法 ID 不符 | 檢查送出的 payload，不自動重送 |
| 401 | 既有登入驗證未通過 | 走現有登入／token 處理流程 |
| 404 | fixture 名單不存在；設定／歷史／已讀的子資源 ID 不符或不屬該名單 | 檢查是否使用本文件固定 ID |

目前 `increase-capacity` 的 expectedLimitCount 不是 10 回 400；unlock 使用錯誤 passwordID／questionID 或 inactive 題目也回 400。不要直接套用尚未實作的正式 409 衝突或密碼錯誤情境。

Creator 的 400 範例：

```json
{
  "code": "400",
  "message": "Invalid mock request",
  "content": null,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Check request fields and Idempotency-Key"
  }
}
```

Creator 的 404 範例：

```json
{
  "code": "404",
  "message": "Mock fixture not found",
  "content": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Use the documented mock list and child IDs"
  }
}
```

Unlock 的 error.message 與 creator 不同，但 400／404 的 error.code 分別同為 INVALID_REQUEST／RESOURCE_NOT_FOUND。401 沿用舊 middleware 的錯誤格式，請按 HTTP status 處理，不假設一定有相同的 error.code。

## 14. 建議串接順序與驗收範圍

| 畫面／操作 | 呼叫順序 | 現階段可核對 |
| --- | --- | --- |
| 新增名單 | POST /creator/lists → 依回傳 id GET 編輯設定 | 三種 method 的 request 與成功回應 |
| 編輯名單 | GET 編輯設定 → PATCH，附 editToken | 表單欄位、lock 合併提交、false／省略／空字串 |
| 顯示密碼／名額 | GET 密碼名單設定 → POST increase-capacity | 密碼顯示、額滿與 +10 回應 |
| 題目歷史／回答 | GET questions → 選題 → POST answers/read → GET answers | active／inactive 題、分頁、回答者資料與單題路由 |
| 讀者解鎖表單 | 使用固定名單 ID／方法 ID／lockToken → POST unlock | 密碼／回答兩種 payload 與 access 回應 |

Mock 不保存狀態：同一方法每次建立回相同 ID，PATCH 只回顯此次輸入，GET 始終回固定資料；加額後 GET 仍額滿；標已讀後摘要不變；問答解鎖後列表不增加回答。畫面若要演示儲存後變化，可保留本次成功回應作本機展示，但應把它視為 mock 預覽，不能以重新 GET 後的固定值判定後端儲存失敗。

目前可以驗收請求／回應解析、表單組合、名額顯示、分頁與畫面狀態。真實儲存、owner 授權、密碼驗證、資格重置、未讀計算、去重與衝突，以及新舊流程正式切換留待後續。

## 15. 可直接使用的請求檔

- [mock-api.http](mock-api.http)：使用既有 REST Client 開啟，替換 baseURL 與 token 後送出請求；範例 localhost:7777 僅為本機示意，以實際服務位址為準。
- [mock-api-examples.json](mock-api-examples.json)：15 組固定 request／response，可供前端 fixtures 或對照。

範例 JSON 檔的 `request: null` 表示「沒有 request body」，不代表要送出 JSON null。Swagger 生成文件尚未更新此次新增 API，請以本文件與上述請求檔串接。

---

## 前端備註（FE 補充，非 BE 原文）

以上為 BE 原文，未修改。以下由前端補充，記錄日期 2026-10-22。

### 已確認

- **上鎖與隱藏互斥。** 不能同時設定 `lock.method ≠ none` 和 `type = 2`。UI 已實作這條規則（`src/app/list/_components/Form/_components/VisibilityFields/index.tsx`）：
  - 開啟「設定上鎖」時，自動改成「公開」。
  - 選擇「隱藏」時，自動關閉上鎖。

### UI 待補

- 上鎖方式的選擇：密碼或問答。目前 UI 只有一個上鎖開關（`boolean`），BE 的 `lock.method` 有三個值。
- 問答題目的輸入框：1～60 個 Unicode code point。
- 編輯時 `lock.resetReadPermissions` 的選項：保留或重置已解鎖的讀者。只要 PATCH 帶 `lock`，這個欄位就是必填。

### 待問 BE

- 新舊 API（`/lists` 與 `/creator/lists`）的切換時程。

### §15 的請求檔

- `mock-api.http`、`mock-api-examples.json` 不會放進本 repo，Mock 資料由 BE 的 API 直接提供。§15 的這兩個連結在 repo 內無效，屬正常情況。

### 串接前要處理的差異

- 專案沒有 `Idempotency-Key`。key 要在每次 mutation 開始時產生，網路重試時沿用同一把，不能在 axios interceptor 裡每個 request 自動產生。
- 專案沒有 PATCH 的 contract，要照 `docs/ARCHITECTURE.md` §4.2 的流程新增（schema → contract → query → hook）。
- BE 不接受 request 裡有 `null`：
  - 表單的 `coverImage` 可能是 `null`，送出前要轉成空字串或不送。
  - 表單的 `categoryID` 預設是 `0`，BE 要求大於 0。沒選分類時不送，BE 會預設為 1。
- 題目和回答的字數用 `[...str].length` 計算，不要用 `.length`（UTF-16 長度）。
- 標記已讀的 POST 不能送 body，contract 用 `c.noBody()`。不要照抄 `deleteListsContract` 的 `body: z.object({})`。
- `e2e/mock-server/server.ts` 還沒有 `/creator/*` 路由。
