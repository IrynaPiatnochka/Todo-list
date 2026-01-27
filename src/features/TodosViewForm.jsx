import { useState, useEffect } from "react";

const TodosViewForm = ({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) => {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  const preventRefresh = (e) => e.preventDefault();

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>
          Search todos:
          <input
            type="text"
            value={localQueryString}
            onChange={(e) => setLocalQueryString(e.target.value)}
          />
        </label>

        <button type="button" onClick={() => setLocalQueryString("")}>
          Clear
        </button>
      </div>

      <div>
        <label>
          Sort by:
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select>
        </label>

        <label>
          Direction:
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
    </form>
  );
};

export default TodosViewForm;
