import './App.css'

function App() {
const todos = [
  {id: 1, title: "Review Theoretical Material"},
  {id: 2, title: "Set Up the Project"},
  {id: 3, title: "Write the Code"},
  {id: 3, title: "Debug the Code"},

]

  return (
    <div>
      <h1>My Todos</h1>
      <ul>
        {todos.map(todo=> <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  );
}

export default App
