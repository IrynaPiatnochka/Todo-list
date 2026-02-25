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
import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import About from './pages/About';
import NotFound from './pages/NotFound';
import MainLayout from "./shared/MainLayout";


const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const location = useLocation();
  const [title, setTitle] = useState("Todo List");
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
  const options = {
    method: "GET",
    headers: {
      Authorization: token,
    },
  };

    async function fetchTodos() {
      dispatch({ type: todoActions.fetchTodos });

      try {
        const response = await fetch(encodeUrl(), options);

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const { records } = await response.json();

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
    }

    fetchTodos();
  }, [encodeUrl]);


    async function addTodo(title) {
      dispatch({ type: todoActions.startRequest });

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  title,
                  isCompleted: false,
                },
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add todo");
        }

        const { records } = await response.json();

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
      const originalTodo = todoState.todoList.find(
        (todo) => todo.id === editedTodo.id
      );

      dispatch({
        type: todoActions.updateTodo,
        editedTodo,
      });

      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              {
                id: editedTodo.id,
                fields: {
                  title: editedTodo.title,
                  isCompleted: editedTodo.isCompleted,
                },
              },
            ],
          }),
        });

        if (!response.ok) {
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
      const originalTodo = todoState.todoList.find(
        (todo) => todo.id === todoId
      );

      dispatch({
        type: todoActions.completeTodo,
        id: todoId,
      });

      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              {
                id: todoId,
                fields: {
                  title: originalTodo.title,
                  isCompleted: true,
                },
              },
            ],
          }),
        });

        if (!response.ok) {
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
    <div className={styles.app} style={{ backgroundImage: `url(${bgImage})` }}>
      <div className={styles.container}>
        <Routes>
          <Route element={<MainLayout title={title} />}>
            <Route
              path="/"
              element={
                <TodosPage
                  {...todoState}
                  dispatch={dispatch}
                  addTodo={addTodo}
                  updateTodo={updateTodo}
                  completeTodo={completeTodo}
                  sortField={sortField}
                  setSortField={setSortField}
                  sortDirection={sortDirection}
                  setSortDirection={setSortDirection}
                  queryString={queryString}
                  setQueryString={setQueryString}
                />
              }
            />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/about" element={<About />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
