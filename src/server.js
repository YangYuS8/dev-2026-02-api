import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = "/api";
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";
const MAX_TASKS = 5000;

app.use(cors({ origin: ALLOW_ORIGIN }));
app.use(express.json({ limit: "128kb" }));
app.use("/apidoc", express.static("public/apidoc"));

let nextId = 4;
let tasks = [
  { id: 1, title: "整理接口文档", owner: "张三", status: "doing", createdAt: new Date().toISOString() },
  { id: 2, title: "完成首页样式", owner: "李四", status: "todo", createdAt: new Date().toISOString() },
  { id: 3, title: "检查表单提交", owner: "王五", status: "done", createdAt: new Date().toISOString() }
];

function normalizeStatus(status) {
  return ["todo", "doing", "done"].includes(status) ? status : null;
}

/**
 * @api {get} /api/health 健康检查
 * @apiName HealthCheck
 * @apiGroup System
 *
 * @apiSuccess {Boolean} success 请求是否成功。
 * @apiSuccess {String} message 状态说明。
 */
app.get(`${API_BASE}/health`, (req, res) => {
  res.json({ success: true, message: "ok" });
});

/**
 * @api {get} /api/tasks 获取任务列表
 * @apiName GetTasks
 * @apiGroup Tasks
 *
 * @apiSuccess {Boolean} success 请求状态。
 * @apiSuccess {Object[]} data 任务列表。
 * @apiSuccess {Number} data.id 任务 ID。
 * @apiSuccess {String} data.title 任务标题。
 * @apiSuccess {String} data.owner 负责人。
 * @apiSuccess {String="todo","doing","done"} data.status 任务状态。
 * @apiSuccess {String} data.createdAt 创建时间（ISO 格式）。
 */
app.get(`${API_BASE}/tasks`, (req, res) => {
  res.json({ success: true, data: tasks });
});

/**
 * @api {post} /api/tasks 新增任务
 * @apiName CreateTask
 * @apiGroup Tasks
 *
 * @apiBody {String} title 任务标题。
 * @apiBody {String} owner 负责人。
 * @apiBody {String="todo","doing","done"} status 任务状态。
 *
 * @apiSuccess {Boolean} success 请求状态。
 * @apiSuccess {String} message 成功提示信息。
 * @apiSuccess {Object} data 新建成功后的任务对象。
 */
app.post(`${API_BASE}/tasks`, (req, res) => {
  const { title, owner, status } = req.body || {};

  if (!title || !owner || !status) {
    return res.status(400).json({
      success: false,
      message: "title, owner and status are required."
    });
  }

  const normalizedStatus = normalizeStatus(status);
  if (!normalizedStatus) {
    return res.status(400).json({
      success: false,
      message: "status must be one of: todo, doing, done."
    });
  }

  if (tasks.length >= MAX_TASKS) {
    tasks = tasks.slice(-1000);
  }

  const newTask = {
    id: nextId++,
    title: String(title).trim().slice(0, 100),
    owner: String(owner).trim().slice(0, 50),
    status: normalizedStatus,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);

  return res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: newTask
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found." });
});

app.listen(PORT, () => {
  console.log(`dev-2026-02 api server running on port ${PORT}`);
});
