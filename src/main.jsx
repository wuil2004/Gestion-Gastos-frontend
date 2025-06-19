// src/main.jsx
import React from 'react'; // Es buena práctica importar React explícitamente
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importamos BrowserRouter
import App from './App.jsx'; // Tu componente principal
import './index.css'; // Tus estilos globales, si los tienes

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envuelve tu App con Router para que el enrutamiento funcione */}
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);