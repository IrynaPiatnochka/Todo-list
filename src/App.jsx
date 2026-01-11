import { useState } from 'react';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import './App.css';

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
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });

    setTodoList(updatedTodos);
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );

    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </div>
  );
}

export default App;
