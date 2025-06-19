import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { getRecentTransactions } from '../api/transactionService';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await getRecentTransactions();
        console.log("Datos de transacciones:", data);
        setTransactions(data);
      } catch (err) {
        console.error("Error loading transactions:", err);
        setError("Error al cargar transacciones");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Cargando transacciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex justify-center">Últimos 6 movimientos</h1>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No hay transacciones recientes</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((transaction) => (
            <Card 
              key={transaction._id} 
              transaction={transaction} 
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;