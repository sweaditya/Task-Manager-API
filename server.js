require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express"); 
// Express library ko import kar rahe hain.
// Express server aur API routes banane mein help karta hai.

const app = express();
const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
    }
}

connectDB();
// Express application create kar rahe hain.
// 'app' ka use routes aur middleware define karne ke liye hoga.

app.use(express.json());
// Middleware jo incoming JSON request body ko parse karta hai.
// Iske baad hum req.body.title jaise data ko access kar sakte hain.

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
    // req = client ki request ki information.
    // res = client ko response bhejne ke liye.
    // next() = control ko agle middleware ya route par bhejta hai.

    console.log("A request came!");
    // Har incoming request par terminal mein message print hoga.

    next();
    // Request ko aage process hone deta hai.
});

// TEMPORARY TASK DATA
const tasks = [
    {
        id: 1, // Task ki unique ID.
        title: "Learn Node.js", // Task ka naam.
        completed: false // false ka matlab task abhi incomplete hai.
    },
    {
        id: 2,
        title: "Practise Express",
        completed: true // true ka matlab task complete hai.
    }
];
// Abhi tasks JavaScript array mein store hain.
// Server restart hone par array ke changes reset ho jaayenge.

// HOME ROUTE
app.get("/", (req, res) => {
    // GET / request aane par ye function chalega.

    res.send("Task Manager API is Running");
    // Client ko simple text response bhej rahe hain.
});

// GET ALL TASKS
app.get("/tasks", (req, res) => {
    // GET /tasks request par saare tasks return honge.

    res.json(tasks);
    // Tasks array ko JSON response mein bhejta hai.
});

// GET ONE TASK BY ID
app.get("/tasks/:id", (req, res) => {
    // :id dynamic route parameter hai.
    // Example: /tasks/2 mein req.params.id ki value "2" hogi.

    const taskID = Number(req.params.id);
    // URL se mili ID string hoti hai.
    // Number() usse number mein convert karta hai.

    const task = tasks.find((t) => t.id === taskID);
    // find() array mein pehla matching task search karta hai.
    // t har task ko represent karta hai.
    // Agar ID match ho, toh woh task return hota hai.
    // Match na mile, toh task ki value undefined hoti hai.

    if (!task) {
        // Agar matching task nahi mila, toh ye block chalega.

        return res.status(404).json({
            error: "Task not found"
        });
        // 404 ka matlab requested task nahi mila.
        // return route ko yahin rok deta hai.
    }

    res.json(task);
    // Task mil gaya toh sirf wahi task client ko return karte hain.
});

app.put("/tasks/:id",(req,res)=>{
    const taskID = Number(req.params.id);
    const task = tasks.find((t)=> t.id === taskID);

    if(!task){
        return res.status(404).json({
            error: "Task not found"
       });
    }

    if(!req.body.title || req.body.title.trim() === ""){
        return res.status(400).json({
            error : "Task title is required"
        });
    }
    task.title = req.body.title.trim();
    if(typeof req.body.completed === "boolean"){
        task.completed = req.body.completed;
    }

    res.json(task);
});



app.delete("/tasks/:id",(req,res)=>{
    const taskId = Number(req.params.id);
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if(taskIndex === -1){
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const deleteTask = tasks.splice(taskIndex,1);

    res.json({
        message: "Task deleted successfully",
        task: deleteTask[0]
    });

});















// CREATE A NEW TASK
app.post("/tasks", (req, res) => {
    // POST /tasks request se naya task create hoga.

    if (
        typeof req.body.title !== "string" ||
        req.body.title.trim() === ""
    ) {
        // Check 1: title string nahi hai toh input invalid hai.
        // Check 2: trim() ke baad title empty hai toh bhi invalid hai.
        // || ka matlab hai: dono mein se koi ek condition true ho.

        return res.status(400).json({
            error: "Task title must be a non-empty string"
        });
        // 400 ka matlab client ne invalid input bheja.
        // return ke kaaran neeche ka task-creation code nahi chalega.
    }

    const newTask = {
        id: tasks.length + 1,
        // Array mein jitne tasks hain, usse ek zyada ID assign karte hain.
        // Ye basic approach hai; delete ke baad duplicate ID ka risk ho sakta hai.

        title: req.body.title.trim(),
        // Request body se title lete hain.
        // trim() start aur end ke extra spaces hata deta hai.

        completed: false
        // Naya task default roop se incomplete rahega.
    };

    tasks.push(newTask);
    // Naye task ko tasks array ke end mein add karte hain.

    res.status(201).json(newTask);
    // 201 ka matlab naya resource successfully create hua.
    // Naye task ka data response mein bhejte hain.
});

// START THE SERVER
app.listen(3000, () => {
    // Server ko port 3000 par start karte hain.

    console.log("Server running on port 3000");
    // Server start hone par terminal mein message print hota hai.
});
