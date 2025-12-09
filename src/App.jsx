import {useState} from "react"
import TodoList from './TodoList.jsx'
import TodoForm from './TodoForm.jsx'
import './App.css'

function App() {

  const [newTodo, setNewTodo] = useState("new todo");

  const todos = [
  {id: 1, title: "Review Theoretical Material"},
  {id: 2, title: "Set Up the Project"},
  {id: 3, title: "Write the Code"},
  {id: 4, title: "Debug the Code"},
]

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList todos={todos} />
    </div>
  );
}

export default App
