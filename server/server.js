import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors()); // allow frontend requests
app.use(express.json()); // parse JSON bodies

// In-memory tasks
let tasks = [];

// ✅ Get all tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// ✅ Get single task
app.get("/tasks/:id", (req, res) => {
    const task = tasks.find((t) => t._id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
});

// ✅ Add new task
app.post("/tasks", (req, res) => {
    const { name, description, status } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });

    const newTask = {
        _id: uuidv4(),
        name,
        description: description || "",
        status: status || "Incomplete",
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// ✅ Update task
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const task = tasks.find((t) => t._id === id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (name !== undefined) task.name = name;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    res.json(task);
});

// ✅ Delete task
app.delete("/tasks/:id", (req, res) => {
    tasks = tasks.filter((t) => t._id !== req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(5000, () =>
    console.log("Server running on http://localhost:5000")
);