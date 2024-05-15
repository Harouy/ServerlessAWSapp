import React, { useState } from "react";

function TodoApp() {
  // State for storing the list of todos
  const [todos, setTodos] = useState([]);
  // State for storing the input value
  const [inputValue, setInputValue] = useState("");
  // State for tracking editing state and input value for each todo
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState("");

  // Function to handle adding a new todo
  const addTodo = () => {
    if (inputValue.trim() !== "") {
      setTodos([
        ...todos,
        { id: todos.length + 1, text: inputValue, completed: false },
      ]);
      setInputValue("");
    }
  };

  // Function to handle removing a todo
  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Function to toggle todo completion status
  const toggleTodoCompletion = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  // Function to start editing a todo
  const startEditTodo = (id, text) => {
    setEditTodoId(id);
    setEditTodoText(text);
  };

  // Function to finish editing a todo
  const finishEditTodo = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text: editTodoText };
        }
        return todo;
      })
    );
    setEditTodoId(null);
    setEditTodoText("");
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Todo App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter todo..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 mr-2 focus:outline-none"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none"
        >
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between border-b border-gray-300 py-2"
          >
            {editTodoId === todo.id ? (
              <input
                type="text"
                value={editTodoText}
                onChange={(e) => setEditTodoText(e.target.value)}
                onBlur={() => finishEditTodo(todo.id)}
                autoFocus
                className="flex-1 border-b-0 px-2 py-1 focus:outline-none"
              />
            ) : (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoCompletion(todo.id)}
                  className="mr-2"
                />
                <span
                  onClick={() => startEditTodo(todo.id, todo.text)}
                  className={
                    todo.completed
                      ? "line-through cursor-pointer"
                      : "cursor-pointer"
                  }
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none"
                >
                  Remove
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
