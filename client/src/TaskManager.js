import React, { useState, useEffect } from "react";

const TaskManager = ({ token, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks", {
          headers: { "x-auth-token": token },
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        } else {
          // If token is invalid, log the user out
          onLogout();
        }
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        onLogout();
      }
    };
    fetchTasks();
  }, [token, onLogout]);

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setTitle("");
    } else {
      console.error("Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { "x-auth-token": token },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const toggleComplete = async (id, completed) => {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify({ completed: !completed }),
    });
    if (res.ok) {
      const updatedTask = await res.json();
      setTasks(
        tasks.map((task) => (task._id === id ? updatedTask : task))
      );
    }
  };

  return (
    <div className="task-manager-container">
      <div className="header">
        <h1>Task Manager</h1>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
      <div className="input-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task..."
          className="task-input"
        />
        <button onClick={addTask} className="add-button">
          Add
        </button>
      </div>

      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <span
                style={{ textDecoration: task.completed ? "line-through" : "none" }}
              >
                {task.title}
              </span>
              <div className="task-actions">
                <button
                  onClick={() => toggleComplete(task._id, task.completed)}
                  className="complete-button"
                >
                  {task.completed ? "✅" : "⚪"}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="delete-button"
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-message">No tasks yet. Add one to get started!</p>
      )}
    </div>
  );
};

export default TaskManager;