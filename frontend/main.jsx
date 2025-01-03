// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Import your Tailwind CSS here
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
