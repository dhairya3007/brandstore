// src/config/dataProvider.js

// Using Vite's import.meta.env for environment variables
const MODE = import.meta.env.VITE_API_MODE || 'mock';

export const isMockMode = MODE === 'mock';
export const isRestMode = MODE === 'rest';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
