import {useState} from "react"
import TodoList from "./TodoList.jsx"
import TodoForm from "./TodoForm.jsx"
import './App.css'

function App() {

  const [todoList, setTodoList] = useState([]);

  function addTodo(title) {
    const newTodo = {
      title,
      id: Date.now(),
    }

    setTodoList([...todoList, newTodo])
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App
