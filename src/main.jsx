import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeModeProvider } from './context/ThemeContext'
import CssBaseline from '@mui/material/CssBaseline'
import axios from 'axios'
import './index.css'

// Configure global axios default base URL for API requests
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <CssBaseline />
      <App />
    </ThemeModeProvider>
  </React.StrictMode>,
)
// <!-- Developed by Mohd Ateek 
//email - [mohdateek.dev@gmail.com] 
//https://ateek.netlify.app/-->