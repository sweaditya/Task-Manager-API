const express = require("express");
const app = express();

app.use(express.json());

app.use((req,res,next)=>{
    console.log("A request came!");
    next();
});

app.get("/",(req,res)=>{
    res.send("Task Manager Api is Running");
});

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});