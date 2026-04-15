import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_PATH = "/dev-2026-02";
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";
const MAX_TASKS = 5000;

app.use(cors({ origin: ALLOW_ORIGIN }));
app.use(express.json({ limit: "128kb" }));

let nextId = 4;
let tasks = [
  { id: 1, title: "整理接口文档", owner: "张三", status: "doing", createdAt: new Date().toISOString() },
  { id: 2, title: "完成首页样式", owner: "李四", status: "todo", createdAt: new Date().toISOString() },
  { id: 3, title: "检查表单提交", owner: "王五", status: "done", createdAt: new Date().toISOString() }
];

function normalizeStatus(status) {
  return ["todo", "doing", "done"].includes(status) ? status : null;
}

app.get(`${BASE_PATH}/health`, (req, res) => {
  res.json({ success: true, message: "ok" });
});

app.get(`${BASE_PATH}/tasks`, (req, res) => {
  res.json({ success: true, data: tasks });
});

app.post(`${BASE_PATH}/tasks`, (req, res) => {
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
