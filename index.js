import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { AppError } from "./Utills/appError.js";
import { Task } from "./Models/taskModel.js";
import { CompletedTask } from "./Models/completedTaskModel.js";
import axios from "axios";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.set('view engine', 'ejs');
app.set('Views', path.resolve('./views'))

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL).then(() => {
            app.listen(5000, () => {
                console.log("Mongo Db connected...");
                console.log("Server is listening....");
            })
        })
    } catch (error) {
        console.log("Error", error)
    }
}

connectDB();


app.get('/', async (req, res) => {
    const tasks = await Task.find({}).sort({ createdAt: -1 })
    res.render('Home', {
        tasks
    })
})

app.post('/create-task', async (req, res) => {

    const { title, assoc, module, category } = req.body;

    if (!title || !assoc || !module || !category) {
        throw new AppError('title and assoc is required', 400);
    }

    const task = await Task.create({
        due: Date.now(),
        title,
        assoc,
        module,
        category
    })

    if (!task) {
        res.status(500).json({ message: "Internal Server Error" });
    }

    res.redirect('/')

})

app.post(`/tasks/:taskId`, async (req, res) => {
    const { taskId } = req.params;

    const { isChecked } = req.body;

    let newStatus = ''

    if (isChecked) {
        newStatus = 'Completed'
    } else {
        newStatus = 'Pending'
    }

    if (!taskId) {
        res.status(400).json({ message: "Task id is required" });
    }

    const task = await Task.findOneAndUpdate(
        { _id: taskId },
        { status: newStatus, lastupdated: Date.now() },
        { new: true } // returns the updated document
    );

    if (!task) {
        res.status(500).json({ message: "Internal Server Error" });
    }

    res.status(200).json({ task });
})

app.delete('/tasks/:taskId', async (req, res) => {

    try {
        const { taskId } = req.params;
        if (taskId) {
            res.status(400)
        }

        const completed = await Task.findOne({ _id: taskId });

        const completedTask = await CompletedTask.create({
            taskid: completed._id,
            due:completed.due,
            title:completed.title,
            assoc:completed.assoc,
            status:completed.status,
            lastupdated:completed.lastupdated,
            important:completed.important,
            module:completed.module,
            category:completed.category,
            subtask:completed.subtask,
            marks,
        })


        const task = await Task.deleteOne({ _id: taskId })
        
        completedTask.marks += 10;

        completedTask.save();

        res.status(200).json({ task });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }

})

app.put(`/tasks/:taskId`, async (req, res) => {

    try {
        const { important } = req.body;
        const taskid = req.params;

        if (!taskid) {
            res.status(400).json({ message: "Task id and important is required" })
        }

        const task = Task.findOneAndUpdate({
            _id: taskid
        }, {
            important: important
        }, { new: true })

        if (!task) {
            res.status(500).json({ message: "Internal Server Error" });
        }

        res.status(200).json({ message: "Task Importance Added" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" });
    }

})

app.get('/Today', async (req, res) => {
    const alltasks = await Task.find({}).sort({ createdAt: -1 });
    const completedTask = await CompletedTask.find({}).sort({createdAt:-1});

    let taskwithsamedue = [];
    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
    });
    for (let i = 0; i < alltasks.length; i++) {
        const isoString = alltasks[i].due;
        const day = new Date(isoString).getDate();

        if (day == currentDate) {
            taskwithsamedue.push(alltasks[i])
        }

    }
    const tasks = taskwithsamedue;


    res.render('Today', {
        tasks,
        completedTask
    });
});