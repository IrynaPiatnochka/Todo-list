import { useState, useEffect } from "react";
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleUpdate(event) {
    if (!isEditing) return;

    event.preventDefault();

    onUpdateTodo({...todo, title:workingTitle});
    setIsEditing(false);
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel elementId={`todo-${todo.id}`} value={workingTitle} onChange={handleEdit}/>
            <button type="button" onClick={handleCancel}> Cancel </button>
            <button type="button" onClick={handleUpdate}> Update </button>
          </>
        ) : (
          <>
            <input
              type="checkbox"
              id={`todo-${todo.id}`}
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
            <label htmlFor={`todo-${todo.id}`} onClick={() => setIsEditing(true)}>{todo.title}</label>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;