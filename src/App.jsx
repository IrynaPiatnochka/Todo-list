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
      isCompleted: false,
    };

    setTodoList([...todoList, newTodo]);
  }


  function completeTodo(todoId) {
    const updatedTodos = todoList.map ((todo) => {
      if (todo.id === todoId) {
        return { ...todo, isCompleted: true};
      }
      return todo;
    });

    setTodoList(updatedTodos);
  
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}
  

export default App
