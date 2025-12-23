import { useState } from "react"

function TodoForm({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState("")

    function handleAddTodo(event) {
        event.preventDefault()

        onAddTodo(workingTodoTitle)
        setWorkingTodoTitle("")
    }
    
    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input 
                id="todoTitle" 
                type="text" 
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />
            <button type="submit" disabled={workingTodoTitle === ""}>Add Todo</button>
        </form>
    );
}

export default TodoForm;
