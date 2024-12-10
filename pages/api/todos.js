import mongoose from 'mongoose';
import Todo from '../../models/Todos';

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('Connected to MongoDB');
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const { completed, priority } = req.query;
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
  } else if (req.method === 'POST') {
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
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
