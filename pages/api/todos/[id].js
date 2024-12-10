import mongoose from 'mongoose';
import Todo from '../../../models/Todos';

let isConnected = false; // Track if the database is connected

async function connectDB() {
  if (isConnected) return; // Use existing connection if available
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('Connected to MongoDB');
}

export default async function handler(req, res) {
  const { id } = req.query;

  // Ensure the DB connection is established first
  await connectDB();

  if (req.method === 'PUT') {
    const { task, completed, priority } = req.body;

    try {
      const updatedTodo = await Todo.findByIdAndUpdate(id, { task, completed, priority }, { new: true });
      if (!updatedTodo) return res.status(404).json({ message: 'Task not found' });
      res.status(200).json(updatedTodo);
    } catch (error) {
      res.status(400).json({ message: 'Error updating the task', error });
    }
  } else if (req.method === 'DELETE') {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
      const deletedTodo = await Todo.findByIdAndDelete(id);
      if (!deletedTodo) return res.status(404).json({ message: 'Task not found' });
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
