// main.jsx: liga o React à página e traz o CSS do kit.
// Você não precisa mexer aqui.
import { createRoot } from 'react-dom/client'
import './styles/base.css'
import './styles/kit.css'
import './styles/cartao.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
