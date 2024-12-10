const API_URL = 'http://localhost:5000/api/todos';

export const fetchTodos = async (completed = null) => {
  const url = completed !== null ? `${API_URL}?completed=${completed}` : API_URL;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};


export const createTodo = async (task, priority = 'medium') => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, priority }), 
  });
  const data = await response.json();
  return data;
};


export const updateTodo = async (id, task, completed, priority) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, completed, priority }), 
  });

  if (!response.ok) {
    throw new Error("Failed to update todo");
  }

  const data = await response.json();
  return data;
};


export const deleteTodo = async (id) => {
  const trimmedId = id.trim();
  console.log(`Trimmed ID: ${trimmedId}`);

  const response = await fetch(`${API_URL}/${trimmedId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  return data;
};
