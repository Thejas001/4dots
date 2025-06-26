'use client';

import React from 'react';

const NetworkErrorPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <h2>ERROR 404</h2>
      <p>Server Down</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );
};

export default NetworkErrorPage;
