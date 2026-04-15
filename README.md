# dev-2026-02-api

## 这是做什么的

这是 `dev-2026-02` 考核题配套的 API 服务。

用途：

- 给学生提供任务列表接口
- 提供新增任务接口
- 支持前端做 GET / POST / 数据渲染 / 筛选练习
- 提供线上 apidoc 文档

域名预期：

- API 基础地址：`https://api.yangyus8.top/api`
- API 文档地址：`https://api.yangyus8.top/apidoc/`

---

## 技术选型

这里使用：

- Node.js
- Express
- CORS
- apidoc

原因很简单：

- 足够轻量
- 易部署
- 对这种考核接口完全够用
- 文档可以自动生成，更接近真实开发流程

---

## 接口说明

### 1. 健康检查

```http
GET /api/health
```

### 2. 获取任务列表

```http
GET /api/tasks
```

### 3. 新增任务

```http
POST /api/tasks
Content-Type: application/json
```

---

## 本地启动

### 安装依赖

```bash
npm install
```

### 生成文档

```bash
npm run docs
```

### 启动服务

```bash
npm start
```

默认监听：

- `3000`

---

## 目录说明

```text
.
├── src/
│   └── server.js
├── public/
│   └── apidoc/
└── package.json
```

---

## 建议部署方式

你说你会自己接 Nginx，那这边保持最简单：

- Node 服务监听 `3000`
- Nginx 反代 `/api` 到 Node
- Nginx 也可直接转发 `/apidoc/`

对外提供：

- `https://api.yangyus8.top/api`
- `https://api.yangyus8.top/apidoc/`

---

## 性能与克制设计

为了尽量省资源，这个服务做了这些控制：

- 无数据库，先用内存存储
- JSON body 限制较小
- 字段长度限制
- 任务数量达到阈值后自动裁剪旧数据
- 接口非常少，逻辑非常轻

这意味着：

- 部署简单
- 内存占用低
- 很适合考核期短时间使用

如果你后面想升级成持久化版本，再接 SQLite 也不难。
