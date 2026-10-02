import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Standalone only: the host supplies its own <main>, so App renders a <section>.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);
