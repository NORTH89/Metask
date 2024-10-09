import asyncHandler from 'express-async-handler';
import TaskModel from '../../models/tasks/TaskModel.js';


// create task method
export const createTask = asyncHandler(async (req, res) => {
    try {
        const {title, description, dueDate, priority, status} = req.body;
        // check if title and description are provided
        if (!title || title.trim() === "") {
            res.status(400).json({message: "Title is required!"});
        }
        if (!description || description.trim() === "") {
            res.status(400).json({message: "Description is required!"});
        }
        
            const task = new TaskModel({
                title,
                description,
                dueDate,
                priority,
                status,
                user: req.user._id
            });
            await task.save();

            res.status(201).json(task);
            
        
    } catch (error) {
        console.log("Error creating task: ", error.message);
        res.status(500).json({message: error.message});
    }
});
// get all tasks
export const getTasks = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            res.status(400).json({message: "User not found!"});
        }
        const tasks = await TaskModel.find({user: userId});
        res.status(200).json({
            length: tasks.length,
            tasks
        });
        
    } catch (error) {
        console.log("Error getting tasks: ", error.message);
        res.status(500).json({message: error.message});
    }


});
// get task method
export const getTask = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const {id} = req.params;

        if(!id) {
            res.status(400).json({message: "Please provide id!"});
        }
        const task = await TaskModel.findById(id);
        if(!task) {
            res.status(404).json({message: "Task not found!"});
        }

        if (!task.user.equals(userId)) {
            res.status(401).json({message: "Unauthorized!"});
        }

        res.status(200).json(task);

    } catch (error) {
        console.log("Error getting task: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
    });

// update task by id method
export const updateTask = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const {title, description, dueDate, priority, status} = req.body;

        if(!id) {
            res.status(400).json({message: "Please provide id!"});
        }
        const task = await TaskModel.findById(id);
        
        if(!task) {
            res.status(404).json({message: "Task not found!"});
        }

        if (!task.user.equals(userId)) {
            res.status(401).json({message: "Unauthorized!"});
        }
        // update task
        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        await task.save();

        res.status(200).json(task);

    // error message
    } catch (error) {
        console.log("Error updating task: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
    });


    // delete task method
export const deleteTask = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const {id} = req.params;
        // check if id is provided
        
        const task = await TaskModel.findById(id);
        // check if task exists
        if(!task) {
            res.status(404).json({message: "Task not found!"});
        }
        // check if task belongs to user
        if (!task.user.equals(userId)) {
            res.status(401).json({message: "Unauthorized!"});
        }

        await TaskModel.findByIdAndDelete(id);

        res.status(200).json({message: "Task deleted successfully"});
    
        // error message
    } catch (error) {
        console.log("Error deleting task: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
    });
