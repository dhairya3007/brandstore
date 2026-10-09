// src/services/productService.js
import { getDB, saveDB, delay, generateId } from './mockDatabase';
import { isMockMode } from '../config/dataProvider';

class ProductService {
  async getProducts() {
    if (isMockMode) {
      await delay();
      const db = getDB();
      return { success: true, data: db.products };
    }
    // TODO: implement REST mode
  }

  async getProductBySlug(slug) {
    if (isMockMode) {
      await delay(300);
      const db = getDB();
      const product = db.products.find(p => p.slug === slug);
      if (product) return { success: true, data: product };
      return { success: false, error: { message: 'Product not found' } };
    }
  }

  async createProduct(data) {
    if (isMockMode) {
      await delay(800);
      const db = getDB();
      const newProduct = {
        ...data,
        id: generateId('prod'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.products.push(newProduct);
      saveDB(db);
      return { success: true, data: newProduct };
    }
  }

  async updateProduct(id, data) {
    if (isMockMode) {
      await delay(800);
      const db = getDB();
      const index = db.products.findIndex(p => p.id === id);
      if (index !== -1) {
        db.products[index] = { ...db.products[index], ...data, updatedAt: new Date().toISOString() };
        saveDB(db);
        return { success: true, data: db.products[index] };
      }
      return { success: false, error: { message: 'Product not found' } };
    }
  }

  async deleteProduct(id) {
    if (isMockMode) {
      await delay(800);
      const db = getDB();
      db.products = db.products.filter(p => p.id !== id);
      saveDB(db);
      return { success: true };
    }
  }

  // --- Categories ---
  async getCategories() {
    if (isMockMode) {
      await delay();
      const db = getDB();
      return { success: true, data: db.categories };
    }
  }

  async createCategory(data) {
    if (isMockMode) {
      await delay(500);
      const db = getDB();
      const newCat = {
        ...data,
        id: generateId('cat'),
      };
      db.categories.push(newCat);
      saveDB(db);
      return { success: true, data: newCat };
    }
  }

  async deleteCategory(id) {
    if (isMockMode) {
      await delay(500);
      const db = getDB();
      db.categories = db.categories.filter(c => c.id !== id);
      saveDB(db);
      return { success: true };
    }
  }

  // --- Settings ---
  async getSettings() {
    if (isMockMode) {
      await delay(300);
      const db = getDB();
      if (!db.settings) {
        db.settings = { 
          storeName: 'Brand Store', 
          whatsappNumber: '919876543210', 
          currency: '₹',
          supportEmail: 'support@brandstore.com'
        };
        saveDB(db);
      }
      return { success: true, data: db.settings };
    }
  }

  async updateSettings(settings) {
    if (isMockMode) {
      await delay(500);
      const db = getDB();
      db.settings = settings;
      saveDB(db);
      return { success: true, data: settings };
    }
  }
}

export const productService = new ProductService();
