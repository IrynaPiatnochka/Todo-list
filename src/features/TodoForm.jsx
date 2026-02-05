import { useState } from 'react';
import styled from 'styled-components';
import TextInputWithLabel from '../shared/TextInputWithLabel';

const StyledForm = styled.form`
  padding: 0.5rem;
`;

const StyledButton = styled.button`
  padding: 0.3rem 0.6rem;

  &:disabled {
    font-style: italic;
  }
`;

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
        <StyledForm onSubmit={handleAddTodo}>
            <TextInputWithLabel 
                elementId="todoTitle" 
                labelText="Todo" 
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />
            <StyledButton type="submit" disabled={workingTodoTitle === "" || isLoading}>{isLoading ? "Adding..." : "Add Todo"}</StyledButton>
            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
        </StyledForm>
    );
}

export default TodoForm;
