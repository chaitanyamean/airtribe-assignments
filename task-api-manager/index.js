require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { PORT } = process.env;
const { v1: uuidv1 } = require("uuid");

let tasks = [
  {
    title: "Learn Coding",
    description: "Code description",
    flag: true,
    id: 1,
    priority: "high",
  },
  {
    title: "Learn Cooking",
    description: "Cooking description",
    flag: false,
    id: 2,
    priority: "low",
  },
  {
    title: "Working on Product",
    description: "Product description",
    flag: true,
    id: 3,
    priority: "medium",
  },
];

app.get("/tasks", (req, res) => {
  res.json({
    tasks,
  });
});

app.get("/tasks/:id", (req, res) => {
  let id = req.params.id;
  let selectedTask = tasks.find((task) => task.id == id);

  if (selectedTask) {
    res.json({
      task: selectedTask,
    });
  } else {
    res.json({
      message: "Task Id must be wrong or not existed",
    });
  }
});

app.post("/tasks/", (req, res) => {
  let { title, description, priority } = req.body;
  if (title && description) {
    tasks.push({
      title,
      description,
      priority,
      flag: false,
      id: uuidv1(),
    });
    res.json({
      task: tasks,
      success: "Added Succesfully",
    });
  } else {
    res.json({
      message: "Title, Description and flag are mandatory fileds",
    });
  }
});

app.put("/tasks/:id", (req, res) => {
  let newTaskObj = req.body;
  let id = req.params.id;
  let isValidId = false;
  tasks.find((task) => {
    if (task.id == id) {
      task.title = newTaskObj.title;
      task.flag = newTaskObj.flag;
      task.description = newTaskObj.description;
      task.priority = newTaskObj.priority;
      isValidId = true;
    }
  });

  if (isValidId) {
    res.json({
      success: "Edited Succesfully",
      tasks,
    });
  } else {
    res.json({
      message: "Invalid ID, Please enter valid Task Id",
    });
  }
});

app.delete("/tasks/:id", (req, res) => {
  let id = req.params.id;
  let isValidId = false;

  let newTasks = tasks.filter((task) => task.id != id);
  if (newTasks.length === tasks.length) {
    res.json({
      message: "Invalid ID, Please enter valid Task Id",
    });
  } else {
    tasks = newTasks;
    res.json({
      success: "Deleted Succesfully",
      tasks: newTasks,
    });
  }
});

app.get("/tasks/priority/:level", (req, res) => {
  let level = req.params.level;

  let newTasks = tasks.filter((task) => task.priority == level);
  if (level == "high" || level == "medium" || level == "low") {
    res.json({
      success: "Priority Level",
      tasks: newTasks,
    });
  } else {
    res.json({
      message: "Invalid Priority item or empty",
      tasks: [],
    });
  }
});

app.listen(PORT, () => console.log("Server is running at", PORT));
