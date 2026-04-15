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
 * @api {get} /api/health Health check
 * @apiName HealthCheck
 * @apiGroup System
 *
 * @apiSuccess {Boolean} success Always true.
 * @apiSuccess {String} message Status message.
 */
app.get(`${API_BASE}/health`, (req, res) => {
  res.json({ success: true, message: "ok" });
});

/**
 * @api {get} /api/tasks Get task list
 * @apiName GetTasks
 * @apiGroup Tasks
 *
 * @apiSuccess {Boolean} success Request status.
 * @apiSuccess {Object[]} data Task list.
 * @apiSuccess {Number} data.id Task id.
 * @apiSuccess {String} data.title Task title.
 * @apiSuccess {String} data.owner Task owner.
 * @apiSuccess {String="todo","doing","done"} data.status Task status.
 * @apiSuccess {String} data.createdAt ISO time.
 */
app.get(`${API_BASE}/tasks`, (req, res) => {
  res.json({ success: true, data: tasks });
});

/**
 * @api {post} /api/tasks Create task
 * @apiName CreateTask
 * @apiGroup Tasks
 *
 * @apiBody {String} title Task title.
 * @apiBody {String} owner Task owner.
 * @apiBody {String="todo","doing","done"} status Task status.
 *
 * @apiSuccess {Boolean} success Request status.
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data Created task.
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
