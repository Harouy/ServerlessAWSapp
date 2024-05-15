import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TodoApp from "./Components/Todo";

function App() {
  return (
    <div className="App">
      <div className="text-blue-500">App</div>
      <TodoApp />
    </div>
  );
}

export default App;
