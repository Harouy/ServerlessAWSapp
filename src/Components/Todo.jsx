import React, { useState, useEffect } from "react";

function TodoApp() {
  // State for storing the list of todos
  const [todos, setTodos] = useState([]);
  // State for storing the input value
  const [inputValue, setInputValue] = useState("");
  // State for tracking editing state and input value for each todo
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState("");

  // Fetch all todos from the server when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://i7jp8dpk22.execute-api.us-east-1.amazonaws.com/todos"
      );
      const data = await response.json();
      const formattedTodos = data.map((todo) => ({
        id: todo.todoId.N,
        text: todo.Title.S,
        completed: todo.IsComplete.BOOL,
      }));
      setTodos(formattedTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Function to handle adding a new todo
  const addTodo = async () => {
    if (inputValue.trim() !== "") {
      const newTodo = { title: inputValue };
      try {
        const response = await fetch(
          "https://i7jp8dpk22.execute-api.us-east-1.amazonaws.com/addtodo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo),
          }
        );

        if (!response.ok) {
          throw new Error("Error adding todo");
        }

        // Fetch the updated list of todos
        fetchTodos();

        setInputValue("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  // Function to handle removing a todo
  const removeTodo = async (todoId) => {
    try {
      await fetch(
        `https://i7jp8dpk22.execute-api.us-east-1.amazonaws.com/deletetodo/${todoId}`,
        {
          method: "DELETE",
        }
      );
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleTodoCompletion = async (todoId) => {
    const todo = todos.find((todo) => todo.id === todoId);
    const updatedTodo = {
      Title: todo.text,
      IsComplete: !todo.completed, // Toggle the completion status
    };
    console.log(updatedTodo);

    try {
      const response = await fetch(
        `https://i7jp8dpk22.execute-api.us-east-1.amazonaws.com/todos/${todoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        }
      );

      const result = await response.json();
      /*  setTodos(
        todos.map((todo) =>
          todo.id === todoId ? { ...todo, ...result } : todo
        )
      );*/
      setTodos(
        todos.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                completed: result.IsComplete,
              }
            : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Function to start editing a todo
  const startEditTodo = (todoId, Title) => {
    setEditTodoId(todoId);
    setEditTodoText(Title);
  };

  const finishEditTodo = async (id) => {
    // Find the current todo and update its Title
    const currentTodo = todos.find((todo) => todo.id === id);
    const updatedTodo = {
      ...currentTodo,
      Title: editTodoText,
    };

    try {
      const response = await fetch(
        `https://i7jp8dpk22.execute-api.us-east-1.amazonaws.com/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        }
      );

      // Capture the updated todo object from the response
      const result = await response.json();
      console.log(result);

      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                text: result.Title,
              }
            : todo
        )
      );

      setEditTodoId(null);
      setEditTodoText("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
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
