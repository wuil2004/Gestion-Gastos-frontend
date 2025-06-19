import { useEffect, useState } from 'react';
import { Blocks } from 'lucide-react';
import { getCategories, createCategory } from '../api/categoryService';

const Categorias = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError('Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const createdCategory = await createCategory(newCategory);
      setCategories([...categories, createdCategory]);
      setNewCategory('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear categoría');
    }
  };

  return (
    <section className="w-full h-full p-4">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Blocks size={24} /> Categorías
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col items-center">
          <label className="block text-gray-700 mb-2">Nombre de categoría:</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className='focus:outline-none border border-2 border-slate-400 rounded px-2'
            placeholder="Ej: Comida, Transporte..."
          />
        </div>
        <div className='flex w-full justify-center '>
          <button
            type="submit"
            className='mt-2 bg-emerald-600 text-white px-4 py-1 rounded hover:bg-emerald-800'
          >
            Agregar
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

      </form>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Categorías</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No hay categorías creadas</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category._id}
                className="my-2 shadow-lg ps-3 text-2xl hover:scale-x-101 transition duration-500 bg-white font-bold text-slate-600 rounded"
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Categorias;