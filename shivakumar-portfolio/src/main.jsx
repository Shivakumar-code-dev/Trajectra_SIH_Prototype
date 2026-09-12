import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Purge any old binary noise data from localStorage
try {
  const saved = localStorage.getItem('shivakumar_custom_portfolio_data_v2');
  if (saved && (saved.includes('%PDF') || saved.includes('\uFFFD'))) {
    localStorage.removeItem('shivakumar_custom_portfolio_data_v2');
  }
} catch (e) {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
