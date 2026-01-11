import { useState } from 'react'
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState("")

    function handleAddTodo(event) {
        event.preventDefault()

        onAddTodo(workingTodoTitle)
        setWorkingTodoTitle("")
    }
    
    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel 
                elementId="todoTitle" 
                labelText="Todo" 
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />
            <button type="submit" disabled={workingTodoTitle === ""}>Add Todo</button>
        </form>
    );
}

export default TodoForm;
