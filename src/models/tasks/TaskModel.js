import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Please add a title"],
        unique: true,
    },
    description: {
        type: String,
        required: "No description",

    },
    dueDate: {
        type: Date,
        required: [true, "Please add a due date"],

    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    completed: {
        type: Boolean,
        enum: ["low", "medium", "hight"],
        default: "low",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "hight"],
        default: "low",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

},
{
    timestamps: true,
}
);

const TaskModel = mongoose.model("Task", TaskSchema);

export default TaskModel;
