import TodoListItem from "./TodoListItem";

function TodoList({todos}) {
    return (
        <ul>
            {todos.map((todo) => (
                <TodoListItem key={todo.id} todo={todo}/>
            ))}
        </ul>
    );
}

export default TodoList;

