'use client';
import React from 'react';

const OfflinePage = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '4rem',
        fontFamily: 'monospace',
      }}
    >
      <h1 style={{ fontSize: '3rem' }}>You are offline</h1>
      <p>Check your internet connection and try again.</p>
      <div style={{ fontSize: '5rem' }}>🦖</div>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
};

export default OfflinePage;
