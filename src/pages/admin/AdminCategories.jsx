import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { productService } from '../../backend/productService';
import '../../styles/AdminProducts.css'; // Reusing table styles

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const res = await productService.getCategories();
    if (res.success) {
      setCategories(res.data);
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    setLoading(true);
    const nameUpper = newCatName.trim().toUpperCase();
    const slug = nameUpper.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const res = await productService.createCategory({ name: nameUpper, slug });
    if (res.success) {
      setCategories([...categories, res.data]);
      setNewCatName('');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? (Products in this category might break)')) {
      const res = await productService.deleteCategory(id);
      if (res.success) {
        setCategories(categories.filter(c => c.id !== id));
      }
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <div>
          <h1>Category Management</h1>
          <p>Add or remove categories for your store.</p>
        </div>
      </div>

      <div className="table-controls">
        <form onSubmit={handleAdd} style={{display: 'flex', gap: '1rem', width: '100%', maxWidth: '500px'}}>
          <input 
            type="text" 
            placeholder="New Category Name (e.g. T-SHIRTS)" 
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value.toUpperCase())}
            style={{flexGrow: 1, padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'white'}}
          />
          <button type="submit" className="cta-button primary add-btn" disabled={loading || !newCatName.trim()}>
            <Plus size={20} /> Add
          </button>
        </form>
      </div>

      <div className="table-container">
        {loading && categories.length === 0 ? (
          <div className="admin-loading">Loading categories...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>ID</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td><strong>{cat.name}</strong></td>
                  <td>{cat.slug}</td>
                  <td><span style={{color: 'var(--color-text-muted)', fontSize: 'var(--font-xs)'}}>{cat.id}</span></td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="icon-btn delete" 
                        title="Delete"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="admin-empty">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
