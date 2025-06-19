import { useEffect, useState, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import Card from '../components/Card';
import {
  getTransactions,
  createTransaction,
  getTransactionsByCategory,
  getTransactionsByDate,
  getIncomeTransactions,
  getOutflowTransactions
} from '../api/transactionService';
import { getCategories } from '../api/categoryService';

const Movimientos = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [requiresEnter, setRequiresEnter] = useState(false);
  const searchInputRef = useRef(null);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'ingreso',
    category: ''
  });

  const normalizeDate = useCallback((dateString) => {
    if (!dateString) return null;
    const cleaned = dateString.replace(/[^\d/-]/g, '');
    
    const formats = [
      { regex: /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/, parts: [3, 2, 1] },
      { regex: /^(\d{4})[\/-](\d{2})[\/-](\d{2})$/, parts: [1, 2, 3] },
      { regex: /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2})$/, parts: [3, 2, 1] }
    ];

    for (const format of formats) {
      const match = cleaned.match(format.regex);
      if (match) {
        const year = match[format.parts[0]].length === 2 ? `20${match[format.parts[0]]}` : match[format.parts[0]];
        const month = match[format.parts[1]].padStart(2, '0');
        const day = match[format.parts[2]].padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    return null;
  }, []);

  const performSearch = useCallback(async (term) => {
    setLoading(true);
    try {
      let results = [];
      
      if (!term) {
        results = await getTransactions();
      } else if (normalizeDate(term)) {
        const normalizedDate = normalizeDate(term);
        results = await getTransactionsByDate(normalizedDate);
      } else if (['ingreso', 'egreso'].includes(term.toLowerCase())) {
        const isIncome = term.toLowerCase() === 'ingreso';
        results = isIncome ? await getIncomeTransactions() : await getOutflowTransactions();
      } else {
        const allCategories = await getCategories();
        const matchedCategory = allCategories.find(cat => 
          cat.name.toLowerCase().includes(term.toLowerCase())
        );
        results = matchedCategory ? await getTransactionsByCategory(matchedCategory._id) : [];
      }

      setTransactions(results);
      setError('');
    } catch (error) {
      setError(error.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [normalizeDate]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [initialTransactions, initialCategories] = await Promise.all([
          getTransactions(),
          getCategories()
        ]);
        setTransactions(initialTransactions);
        setCategories(initialCategories);
        if (initialCategories.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            category: initialCategories[0]._id 
          }));
        }
      } catch (error) {
        setError('Error al cargar datos iniciales');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (requiresEnter) return;
    
    const timer = setTimeout(() => {
      performSearch(searchTerm.trim() !== '' ? searchTerm : '');
    }, 600);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch, requiresEnter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setRequiresEnter(value.includes('/') || value.includes('-'));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(searchTerm);
      searchInputRef.current?.blur();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const newTransaction = await createTransaction({
        description: formData.description,
        amount: Number(formData.amount),
        type: formData.type === 'ingreso' ? 'Ingreso' : 'Egreso',
        category: formData.category
      });

      // Actualizar transacciones y categorías
      const [updatedTransactions, updatedCategories] = await Promise.all([
        getTransactions(),
        getCategories()
      ]);
      
      setTransactions(updatedTransactions);
      setCategories(updatedCategories);
      
      setFormData({
        description: '',
        amount: '',
        type: 'ingreso',
        category: updatedCategories[0]?._id || ''
      });
      setError('');
    } catch (error) {
      setError(error.message || 'Error al crear transacción');
    }
  };

  if (loading && transactions.length === 0) {
    return <div className="w-full text-center py-8">Cargando...</div>;
  }

  return (
    <section className='w-full'>
      {/* Formulario de creación */}
      <form onSubmit={handleSubmit} className='bg-white shadow text-center flex flex-col items-center p-4 mb-6'>
        <h1 className='text-3xl mb-4'>Movimientos</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className='flex flex-col w-fit items-start mb-3'>
          <label className='text-slate-600 mb-1'>
            Descripción:
          </label>
          <textarea 
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            className='w-[300px] bg-stone-50 border border-slate-500 focus:outline-none focus:border-emerald-400 p-2'
          />
        </div>

        <div className='flex flex-col w-fit items-start mb-3'>
          <label className='text-slate-600 mb-1'>
            Monto:
          </label>
          <input 
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className='w-[300px] bg-stone-100 border border-slate-500 focus:outline-none focus:border-emerald-400 p-2'
          />
        </div>

        <div className='flex flex-col w-fit items-start mb-3'>
          <label className='text-slate-600 mb-1'>
            Tipo:
          </label>
          <select 
            name="type"
            value={formData.type}
            onChange={handleChange}
            className='w-[300px] bg-stone-100 border border-slate-500 focus:outline-none focus:border-emerald-400 p-2'
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
        </div>

        <div className='flex flex-col w-fit items-start mb-4'>
          <label className='text-slate-600 mb-1'>
            Categoría
          </label>
          <select 
            name="category"
            value={formData.category}
            onChange={handleChange}
            className='w-[300px] bg-stone-100 border border-slate-500 focus:outline-none focus:border-emerald-400 p-2'
          >
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className='flex justify-end w-[300px]'>
          <button
            type="submit"
            className='bg-emerald-400 text-white rounded px-4 py-2 hover:bg-emerald-600'
          >
            Agregar
          </button>
        </div>
      </form>

      { }
      <form className='w-full flex justify-end mb-4'>
        <div className='flex items-center border-b me-3 gap-2 w-[300px]'>
          <Search/>
          <input 
            type="text" 
            placeholder='Filtrar (fecha, tipo, categoría)'
            className='focus:outline-none flex-1 py-1'
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            ref={searchInputRef}
          />
          {requiresEnter && <span className="text-xs text-gray-500">Enter</span>}
        </div>
      </form>

      { }
      <ul className="flex flex-col w-full h-full p-5 items-center gap-2">
        {transactions.length > 0 ? (
          transactions.map(tx => (
            <Card 
              key={tx._id}
              transaction={tx}
            />
          ))
        ) : (
          <li className="text-gray-500 py-4">
            {searchTerm ? 'No se encontraron resultados' : 'No hay movimientos registrados'}
          </li>
        )}
      </ul>
    </section>
  );
};

export default Movimientos;