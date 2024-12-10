import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Todo from './models/Todo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error', err));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the To-Do List API');
});

app.post('/api/todos', async (req, res) => {
  const { task, priority } = req.body;
  const newTodo = new Todo({
    task,
    completed: false,
    priority: priority || 'medium',
  });

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
});

app.get('/api/todos', async (req, res) => {
  const { priority, completed } = req.query;
  try {
    const query = {};
    if (priority) query.priority = priority;
    if (completed !== undefined) query.completed = completed === 'true';

    const todos = await Todo.find(query);
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});


app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { task, completed, priority } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { task, completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating the task', error });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    console.log('Invalid ID format:', id);
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      console.log('Task not found:', id);
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
