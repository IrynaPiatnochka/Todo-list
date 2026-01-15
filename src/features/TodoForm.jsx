import { useState } from 'react'
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    async function handleAddTodo(event) {
        event.preventDefault()
        setIsLoading(true)
        setErrorMessage("")

        try {
          await onAddTodo(workingTodoTitle)
            setWorkingTodoTitle("")
        } catch (error) {
            setErrorMessage("Failed to add todo")
        } finally {
            setIsLoading(false)
        }
        
    }
    
    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel 
                elementId="todoTitle" 
                labelText="Todo" 
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />
            <button type="submit" disabled={workingTodoTitle === "" || isLoading}>{isLoading ? "Adding..." : "Add Todo"}</button>
            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
        </form>
    );
}

export default TodoForm;
