const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log("A request came!");
    next();
});

const tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        completed: false
    },
    {
        id: 2,
        title: "Practise Express",
        completed: true
    }
];

app.get("/", (req, res) => {
    res.send("Task Manager API is Running");
});

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
