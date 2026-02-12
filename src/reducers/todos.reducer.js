const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',

  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',

  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',

  revertTodo: 'revertTodo',
  clearError: 'clearError',
};


const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: '',

};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };

    case actions.loadTodos: {
        const todos = action.records.map(record => ({
            id: record.id,
            ...record.fields,
        }));

        return {
            ...state,
            todoList: todos,
            isLoading: false,
        };
    }

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
        isSaving: false,
      };

    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };

    case actions.addTodo: {
        const record = action.record;

        const savedTodo = {
            id: record.id,
            ...record.fields,
            isCompleted: record.fields.isCompleted ?? false,
        };

        return {
            ...state,
            todoList: [...state.todoList, savedTodo],
            isSaving: false,
        };
    }

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    case actions.revertTodo:
    case actions.updateTodo: {
        const updatedTodos = state.todoList.map(todo =>
            todo.id === action.editedTodo.id
            ? action.editedTodo
            : todo
        );

        const updatedState = {
            ...state,
            todoList: updatedTodos,
        };

        if (action.error) {
            updatedState.errorMessage = action.error.message;
        }

        return updatedState;
    }


    case actions.completeTodo: {
        const updatedTodos = state.todoList.map(todo =>
            todo.id === action.id
            ? { ...todo, isCompleted: true }
            : todo
        );

        return {
            ...state,
            todoList: updatedTodos,
        };
    }

    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };

    default:
      return state;
  }
}

export { actions, initialState, reducer };