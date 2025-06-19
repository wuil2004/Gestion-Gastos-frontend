const NavBar = ({ ruta, setRutas, onLogout }) => {
  return (
    <nav className='w-full px-4 py-2 bg-sky-500 shadow-md'>
      <ul className='flex justify-between items-center'>
        <div className='flex gap-6 text-lg'>
          <li>
            <button
              onClick={() => setRutas("/dashboard")}
              className={`${ruta === "/dashboard" ? 'text-amber-600' : 'text-gray-600'} hover:text-emerald-500 transition-colors`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setRutas("/categorias")}
              className={`${ruta === "/categorias" ? 'text-amber-600' : 'text-gray-600'} hover:text-emerald-500 transition-colors`}
            >
              Categorías
            </button>
          </li>
          <li>
            <button
              onClick={() => setRutas("/movimientos")}
              className={`${ruta === "/movimientos" ? 'text-amber-600' : 'text-gray-600'} hover:text-emerald-500 transition-colors`}
            >
              Movimientos
            </button>
          </li>
        </div>
        <li>
          <button
            onClick={onLogout}
            className='text-gray-600 hover:text-emerald-500 transition-colors'
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;