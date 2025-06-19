import { useEffect, useState } from 'react';
import Form from './routers/Form';
import Dashboard from './routers/Dashboard';
import NavBar from './components/NavBar';
import Categorias from './routers/Categorias';
import Movimientos from './routers/Movimientos';

const App = () => {
  const [ruta, setRuta] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      if (ruta === '/') setRuta('/dashboard');
    }
  }, [ruta]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setRuta('/');
  };

  return (
    <div className='w-screen h-screen bg-slate-50 flex flex-wrap justify-center'>
      {isAuthenticated && (
        <NavBar ruta={ruta} setRutas={setRuta} onLogout={handleLogout} />
      )}
      
      {ruta === "/" ? (
        <Form ruta={setRuta} setIsAuthenticated={setIsAuthenticated} />
      ) : ruta === "/dashboard" ? (
        <Dashboard />
      ) : ruta === "/categorias" ? (
        <Categorias />
      ) : ruta === "/movimientos" ? (
        <Movimientos />
      ) : null}
    </div>
  );
};

export default App;