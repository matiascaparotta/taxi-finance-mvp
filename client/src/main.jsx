import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerTaxFinServiceWorker } from './services/pwaService.js'

registerTaxFinServiceWorker().catch(() => {
  // La aplicación web continúa disponible aunque el navegador rechace la PWA.
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
