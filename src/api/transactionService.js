import api from "./api";

export const getTransactions = async () => {
  try {
    const response = await api.get('/transaction');
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getRecentTransactions = async (limit = 6) => {
  try {
    const transactions = await getTransactions();
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map(tx => ({
        ...tx,
        category: tx.category ? tx.category : { name: 'Sin categoría' }
      }));
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/transaction', transactionData);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

export const getTransactionsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/transaction/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions by category:", error);
    throw error;
  }
};

export const getTransactionsByDate = async (date) => {
  try {
    const response = await api.get(`/transaction/date/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions by date:", error);
    throw error;
  }
};

export const getIncomeTransactions = async () => {
  try {
    const response = await api.get('/transaction/income');
    return response.data;
  } catch (error) {
    console.error("Error fetching income transactions:", error);
    throw error;
  }
};

export const getOutflowTransactions = async () => {
  try {
    const response = await api.get('/transaction/outflow');
    return response.data;
  } catch (error) {
    console.error("Error fetching outflow transactions:", error);
    throw error;
  }
};

export default {
  getTransactions,
  getRecentTransactions,
  createTransaction,
  getTransactionsByCategory,
  getTransactionsByDate,
  getIncomeTransactions,
  getOutflowTransactions
};