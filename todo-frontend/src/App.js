import React, { useState, useEffect } from "react";
import "./App.css";
import APIHelper from "./APIHelper.js";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await APIHelper.getAllTodos();
      setTodos(todos);
    };
    fetchTodoAndSetTodos();
  }, []);

  const createTodo = async (e) => {
    e.preventDefault();
    if (!todo) {
      alert("please enter something");
      return;
    }
    if (todos.some(({ task }) => task === todo)) {
      alert(`Task: ${todo} already exists`);
      return;
    }
    const newTodo = await APIHelper.createTodo(todo);
    console.log(newTodo);
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation();
      await APIHelper.deleteTodo(id);
      setTodos(todos.filter(({ _id: i }) => id !== i));
    } catch (err) {}
  };

  const toggleCompleted = async (id) => {
    const updatedTodo = await APIHelper.updateTodo(id, {
      completed: !todos.find((todo) => todo._id === id).completed,
    });
    setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          value={todo}
          onChange={({ target }) => setTodo(target.value)}
          placeholder="Enter a todo"
        />
        <button type="button" onClick={createTodo}>
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.length ? (
          todos.map(({ _id, task, completed }, i) => (
            <li key={i} className={`todo-item ${completed ? "completed" : ""}`}>
              <input
                type="checkbox"
                checked={completed}
                onChange={() => toggleCompleted(_id)}
              />
              <span>{task}</span>
              <span
                className="delete-button"
                onClick={(e) => deleteTodo(e, _id)}
              >
                X
              </span>
            </li>
          ))
        ) : (
          <p>No Todos Yet :(</p>
        )}
      </ul>
    </div>
  );
}

export default App;
