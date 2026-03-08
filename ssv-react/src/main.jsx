import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
// Import shared global utilities (glass-card, shine-hover, float-card, etc.)
// The file lives at the repository root and contains the shared UI helpers used
// across the non-React pages. Importing it here enables those utility classes
// (e.g. .glass-card) inside the React app.
import '../../shared-media.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
