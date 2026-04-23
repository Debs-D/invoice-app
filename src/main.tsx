import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactModal from 'react-modal'
// @ts-ignore
import './index.css'
import App from './App'

ReactModal.setAppElement('#root')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)