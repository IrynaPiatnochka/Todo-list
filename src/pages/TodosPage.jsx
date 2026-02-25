import TodoForm from '../features/TodoForm.jsx';
import TodoList from '../features/TodoList/TodoList.jsx';
import TodosViewForm from '../features/TodosViewForm';
import styles from '../App.module.css';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function TodosPage({
  todoList,
  isLoading,
  errorMessage,
  isSaving,
  dispatch,
  addTodo,
  updateTodo,
  completeTodo,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const filteredTodoList = todoList; 
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const currentTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      <TodoList
        todoList={currentTodos}
        isLoading={isLoading}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />

      {totalPages > 1 && (
        <div className={styles.paginationControls} style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <hr />

      {errorMessage && (
        <div className={styles.errorBox}>
          <hr />
          <p className="error">{errorMessage}</p>
          <button onClick={() => dispatch({ type: 'clearError' })}>
            Dismiss
          </button>
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
    </>
  );
}

export default TodosPage;