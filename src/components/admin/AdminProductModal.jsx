import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { productService } from '../../backend/productService';
import '../../styles/AdminProductModal.css';

export default function AdminProductModal({ product, onClose, onSave }) {
  const isEditing = !!product;
  const [categories, setCategories] = useState([]);
  const [availablePolicies, setAvailablePolicies] = useState([]);
  const [policyDropdownOpen, setPolicyDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    salePrice: '',
    categoryId: '',
    description: '',
    stock: 10,
    colors: '',
    sizes: '',
    images: [''],
    isNew: false,
    isFeatured: false,
    policies: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [resCat, resSet] = await Promise.all([
        productService.getCategories(),
        productService.getSettings()
      ]);
      
      if (resCat.success && resCat.data.length > 0) {
        setCategories(resCat.data);
        if (!product) {
          setFormData(prev => ({ ...prev, categoryId: resCat.data[0].id }));
        }
      }
      if (resSet.success && resSet.data.storePolicies) {
        setAvailablePolicies(resSet.data.storePolicies);
      } else {
        setAvailablePolicies([
          "Free Shipping on orders over ₹5000",
          "7-Day Return Policy",
          "Premium Packaging included",
          "Express Delivery Available",
          "Cash on Delivery Available"
        ]);
      }
    };
    fetchData();
  }, [product]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        categoryId: product.categoryId || (categories.length > 0 ? categories[0].id : 'cat_1'),
        description: product.description || '',
        stock: product.stock !== undefined ? product.stock : 10,
        colors: product.colors ? product.colors.join(', ') : '',
        sizes: product.sizes ? product.sizes.join(', ') : '',
        images: product.images && product.images.length ? [...product.images] : [''],
        isNew: product.isNew || false,
        isFeatured: product.isFeatured || false,
        policies: product.policies || []
      });
    }
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Quick check to prevent huge files from crashing localStorage
    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleImageChange(index, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handlePolicyChange = (policy) => {
    setFormData(prev => {
      const current = prev.policies;
      if (current.includes(policy)) {
        return { ...prev, policies: current.filter(p => p !== policy) };
      } else {
        return { ...prev, policies: [...current, policy] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      stock: Number(formData.stock),
      colors: formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      // Clean up empty image strings
      images: formData.images.filter(img => img.trim() !== '')
    };

    if (payload.images.length === 0) {
      payload.images = ['https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800']; // default placeholder
    }

    await onSave(payload, isEditing ? product.id : null);
    setLoading(false);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <form className="admin-modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group" style={{flex: 2}}>
              <label>Product Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Premium Silk Blend Shirt"
              />
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>SKU</label>
              <input 
                type="text" 
                name="sku" 
                value={formData.sku} 
                onChange={handleChange} 
                required 
                placeholder="e.g. BS-JK-001"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Regular Price (₹)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Sale Price (₹) - Optional</label>
              <input 
                type="number" 
                name="salePrice" 
                value={formData.salePrice} 
                onChange={handleChange} 
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleChange} 
                required 
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Colors (Comma Separated)</label>
              <input 
                type="text" 
                name="colors" 
                value={formData.colors} 
                onChange={handleChange} 
                placeholder="e.g. Black, Navy, White"
              />
            </div>
            <div className="form-group">
              <label>Sizes (Comma Separated)</label>
              <input 
                type="text" 
                name="sizes" 
                value={formData.sizes} 
                onChange={handleChange} 
                placeholder="e.g. 38, 40, 42, 44 OR S, M, L, XL"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              rows="4"
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label>Product Images (URL or Upload)</label>
            {formData.images.map((img, index) => {
              const isBase64 = img && img.startsWith('data:image');
              return (
                <div key={index} style={{display:'flex', gap:'10px', marginBottom:'10px', alignItems: 'center'}}>
                  {isBase64 ? (
                    <div style={{flexGrow: 1, padding: '0.75rem 1rem', border: '1px solid var(--color-border)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(0,0,0,0.2)'}}>
                      <img src={img} alt="preview" style={{width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px'}} />
                      <span style={{color: 'var(--color-text-muted)', fontSize: 'var(--font-xs)'}}>Uploaded local file</span>
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={img} 
                      onChange={(e) => handleImageChange(index, e.target.value)} 
                      required={index === 0 && !img}
                      placeholder="Image URL (e.g. https://domain.com/img.jpg)"
                      style={{flexGrow: 1}}
                    />
                  )}
                  
                  <label className="cta-button" style={{cursor: 'pointer', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', margin: 0}}>
                    <Upload size={16} style={{marginRight: '5px'}} /> Upload
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(index, e)} 
                      style={{display: 'none'}} 
                    />
                  </label>
                  
                  {formData.images.length > 1 && (
                    <button type="button" onClick={() => removeImageField(index)} className="icon-btn delete" style={{padding: '0 10px'}}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={addImageField} className="cta-button" style={{alignSelf: 'flex-start', padding: '0.5rem 1rem', color: 'var(--color-white)', borderColor: 'var(--color-border)'}}>
              <Plus size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'5px'}} /> Add Another Image
            </button>
          </div>

          <div className="form-group full-width">
            <label>Product Policies</label>
            <div style={{position: 'relative'}}>
              <div 
                onClick={() => setPolicyDropdownOpen(!policyDropdownOpen)}
                style={{
                  border: '1px solid var(--color-border)', 
                  padding: '12px 15px', 
                  backgroundColor: 'var(--color-surface)', 
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '4px',
                  color: 'var(--color-text)'
                }}
              >
                <span>{formData.policies.length} Policies Selected</span>
                <span style={{fontSize: '12px', transform: policyDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}}>▼</span>
              </div>
              
              {policyDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  borderTop: 'none',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 10,
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                  borderBottomLeftRadius: '4px',
                  borderBottomRightRadius: '4px'
                }}>
                  {availablePolicies.length === 0 ? (
                    <span style={{color: 'var(--color-text-muted)', fontSize: '14px'}}>No policies configured in settings.</span>
                  ) : (
                    availablePolicies.map(policy => (
                      <label key={policy} className="checkbox-label" style={{alignItems: 'flex-start', margin: 0}}>
                        <input 
                          type="checkbox" 
                          checked={formData.policies.includes(policy)}
                          onChange={() => handlePolicyChange(policy)}
                        />
                        <span style={{fontSize: '14px'}}>{policy}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="form-row checkbox-row">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="isNew" 
                checked={formData.isNew} 
                onChange={handleChange} 
              />
              Mark as New Arrival
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="isFeatured" 
                checked={formData.isFeatured} 
                onChange={handleChange} 
              />
              Feature on Homepage
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="cta-button" onClick={onClose} disabled={loading} style={{color: 'var(--color-white)', borderColor: 'var(--color-border)'}}>
              Cancel
            </button>
            <button type="submit" className="cta-button primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
