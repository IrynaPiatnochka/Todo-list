const todos = [
  {id: 1, title: "Review Theoretical Material"},
  {id: 2, title: "Set Up the Project"},
  {id: 3, title: "Write the Code"},
  {id: 4, title: "Debug the Code"},
]

function TodoList(){
    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}> {todo.title}</li>
            ))}
        </ul>
    )
}

export default TodoList

