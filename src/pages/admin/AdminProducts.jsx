import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { productService } from '../../backend/productService';
import AdminProductModal from '../../components/admin/AdminProductModal';
import '../../styles/AdminProducts.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [resProd, resCat] = await Promise.all([
      productService.getProducts(),
      productService.getCategories()
    ]);
    
    if (resCat.success) setCategories(resCat.data);
    
    if (resProd.success) {
      const sorted = resProd.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProducts(sorted);
    }
    setLoading(false);
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : id;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const res = await productService.deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.isActive === false ? true : false;
    setProducts(products.map(p => p.id === product.id ? { ...p, isActive: newStatus } : p));
    await productService.updateProduct(product.id, { ...product, isActive: newStatus });
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (payload, id) => {
    const defaultPayload = { ...payload, isActive: payload.isActive !== undefined ? payload.isActive : true };
    if (id) {
      const res = await productService.updateProduct(id, defaultPayload);
      if (res.success) {
        setProducts(products.map(p => p.id === id ? res.data : p));
        setIsModalOpen(false);
      }
    } else {
      const res = await productService.createProduct(defaultPayload);
      if (res.success) {
        setProducts([res.data, ...products]);
        setIsModalOpen(false);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <div>
          <h1>Inventory Management</h1>
        </div>
        <button className="cta-button primary add-btn" onClick={handleAddClick}>
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="table-controls">
        <div className="admin-search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by product name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="admin-loading">Loading products...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Visibility</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="table-product">
                      <img src={product.images[0]} alt={product.name} />
                      <div className="table-product-info">
                        <strong>{product.name}</strong>
                        <span>ID: {product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{getCategoryName(product.categoryId)}</td>
                  <td>
                    {product.salePrice ? (
                      <div>
                        <span className="sale-price">₹{product.salePrice}</span>
                        <span className="original-price strike">₹{product.price}</span>
                      </div>
                    ) : (
                      <span>₹{product.price}</span>
                    )}
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <button 
                      onClick={() => handleToggleStatus(product)}
                      className={`cta-button ${product.isActive !== false ? 'primary' : ''}`}
                      style={{
                        padding: '0.25rem 0.5rem', 
                        fontSize: '11px', 
                        borderColor: product.isActive !== false ? 'var(--color-gold)' : 'var(--color-border)',
                        color: product.isActive !== false ? 'var(--color-white)' : 'var(--color-text-muted)',
                        backgroundColor: product.isActive !== false ? 'var(--color-gold)' : 'transparent'
                      }}
                    >
                      {product.isActive !== false ? 'ON' : 'OFF'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="icon-btn edit" 
                        title="Edit"
                        onClick={() => handleEditClick(product)}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="icon-btn delete" 
                        title="Delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="admin-empty">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <AdminProductModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveProduct} 
        />
      )}
    </div>
  );
}
