import { useState, useEffect, useCallback } from 'react';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import TodosViewForm from "./features/TodosViewForm";
import './App.css';
import styles from './App.module.css';
import bgImage from "./assets/todo-image.png";

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState("");

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;

    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);
  

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

    const options = {
      method: "GET",
      headers: {
        Authorization: token,
      },
    };

    try {
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error("Failed to fetch todos");
      }

      const { records } = await resp.json();

      const fetchedTodos = records.map((record) => {
        const todo = {
          id: record.id,
          ...record.fields,
        };

        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }

        return todo;
      });

      setTodoList(fetchedTodos);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchTodos();
}, [encodeUrl]);

  function addTodo(title) {
    const newTodo = {
      title,
      id: Date.now(),
      isCompleted: false,
    };

    setTodoList([...todoList, newTodo]);
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    const optimisticallyUpdatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? editedTodo : todo
    );
    setTodoList(optimisticallyUpdatedTodos);

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(),options);

      if (!resp.ok) {
        throw new Error("Failed to update todo");
      }
    } catch (error) {
      console.error(error);

      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );

      setTodoList(revertedTodos);
      setErrorMessage(`${error.message}. Reverting todo...`);
    }
  }

  async function completeTodo(todoId) {
    const originalTodo = todoList.find((todo) => todo.id === todoId);

    const completedTodo = {
      ...originalTodo,
      isCompleted: true,
    };

    const optimisticallyUpdatedTodos = todoList.map((todo) =>
      todo.id === todoId ? completedTodo : todo
    );
    setTodoList(optimisticallyUpdatedTodos);

    const payload = {
      records: [
        {
          id: completedTodo.id,
          fields: {
            title: completedTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(),options);

      if (!resp.ok) {
        throw new Error("Failed to complete todo");
      }
    } catch (error) {
      console.error(error);

      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );

      setTodoList(revertedTodos);
      setErrorMessage(`${error.message}. Reverting todo...`);
    }
  }

  return (
    <div 
      className={styles.app}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.container}>

        <h1>My Todos</h1>

        <TodoForm onAddTodo={addTodo} />

        <TodoList
          todoList={todoList}
          isLoading={isLoading}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
        />

        <hr />

        {errorMessage && (
          <div className={styles.errorBox}>
            <hr />
            <p className="error">{errorMessage}</p>
            <button onClick={() => setErrorMessage("")}>Dismiss</button>
          </div>
        )}

        <TodosViewForm
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          queryString={queryString}
          setQueryString={setQueryString}
        />
      </div>
    </div>
  );
}

export default App;
