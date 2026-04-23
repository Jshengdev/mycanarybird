import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'hsl(240 5% 10%)',
          border: '1px solid hsl(240 4% 16%)',
          color: 'hsl(0 0% 95%)',
          fontFamily: 'Outfit, system-ui, sans-serif',
          fontSize: '13px',
        },
      }}
    />
  </React.StrictMode>,
)
