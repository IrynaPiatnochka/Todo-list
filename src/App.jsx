import { useState, useEffect, useCallback, useReducer } from 'react';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import TodosViewForm from "./features/TodosViewForm";
import './App.css';
import styles from './App.module.css';
import bgImage from "./assets/todo-image.png";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';


const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const { todoList, isLoading, errorMessage } = todoState;
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
      dispatch({ type: todoActions.fetchTodos});

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

        dispatch({
          type: todoActions.loadTodos,
          records,
        });

      } catch (error) {
        dispatch({
          type: todoActions.setLoadError,
          error,
        });
      }
    };

    fetchTodos();
  }, [encodeUrl]);


  async function addTodo(title) {
    dispatch({ type: todoActions.startRequest });

    const payload = {
      records: [
        {
          fields: {
            title,
            isCompleted: false,
          },
        },
      ],
    };

    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error("Failed to add todo");
      }

      const { records } = await resp.json();

      dispatch({
        type: todoActions.addTodo,
        record: records[0],
      });

      dispatch({ type: todoActions.endRequest });

    } catch (error) {
      dispatch({
        type: todoActions.setLoadError,
        error,
      });
    }
  }
  
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    dispatch ({
      type: todoActions.updateTodo,
      editedTodo,
    })

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
      const resp = await fetch(url,options);

      if (!resp.ok) {
        throw new Error("Failed to update todo");
      }
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error,
      });
    }
  }

  async function completeTodo(todoId) {
    const originalTodo = todoList.find((todo) => todo.id === todoId);

    dispatch({
      type: todoActions.completeTodo,
      id: todoId,
    });

    const payload = {
      records: [
        {
          id: todoId,
          fields: {
            title: originalTodo.title,
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
      const resp = await fetch(url,options);

      if (!resp.ok) {
        throw new Error("Failed to complete todo");
      }
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error,
      });
    }
  }
      
  return (
    <div 
      className={styles.app}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.container}>

        <h1>My Todos</h1>

        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving}/>

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
            <button onClick={() => dispatch({ type: todoActions.clearError })}> Dismiss </button>
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
