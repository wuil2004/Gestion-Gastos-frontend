import api from './api';

export const getCategories = async () => {
  try {
    const response = await api.get('/category');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async (name) => {
  try {
    const response = await api.post('/category', { name });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const searchCategoriesByName = async (name) => {
  try {
    const response = await api.get(`/category/search/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error searching categories by name:", error);
    throw error;
  }
};

export default {
  getCategories,
  createCategory,
  searchCategoriesByName
};