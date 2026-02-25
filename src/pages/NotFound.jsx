import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Page Not Found</h2>
      <Link to="/">Go back home</Link>
    </div>
  );
}

export default NotFound;