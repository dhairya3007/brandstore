// src/mocks/mockDatabase.js
import { seedProducts, seedCategories, seedStoreSettings } from './seedData';

const DB_KEY = 'brandstore_mock_db_v3';

const initializeDB = () => {
  const existingData = localStorage.getItem(DB_KEY);
  if (!existingData) {
    const initialData = {
      products: seedProducts,
      categories: seedCategories,
      banners: [],
      advertisements: [],
      settings: seedStoreSettings,
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(existingData);
};

export const getDB = () => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : initializeDB();
};

export const saveDB = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for generating IDs
export const generateId = (prefix) => {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
};

// Initialize on load
initializeDB();
