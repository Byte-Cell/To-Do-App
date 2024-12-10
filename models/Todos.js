import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'medium' 
    },
}, {timestamps: true });

// Use `mongoose.models` to prevent overwriting the model if it already exists
const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

export default Todo;
