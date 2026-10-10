import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, AlertTriangle, Sparkles, Megaphone, Save, MessageCircle } from 'lucide-react';
import { productService } from '../../backend/productService';
import '../../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [savingAd, setSavingAd] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [resProd, resSet, resCat] = await Promise.all([
        productService.getProducts(),
        productService.getSettings(),
        productService.getCategories()
      ]);
      
      if (resProd.success) setProducts(resProd.data);
      if (resCat.success) setCategories(resCat.data);
      if (resSet.success) {
        setSettings({
          ...resSet.data,
          adEnabled: resSet.data.adEnabled || false,
          adImage: resSet.data.adImage || '',
          adLinkProduct: resSet.data.adLinkProduct || ''
        });
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSaveAd = async (e) => {
    e.preventDefault();
    setSavingAd(true);
    await productService.updateSettings(settings);
    setSavingAd(false);
    alert('Advertisement settings saved successfully!');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    await productService.updateSettings(settings);
    setSavingSettings(false);
    alert('Contact settings saved successfully!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload a file smaller than 5MB to avoid crashing the local database.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({...settings, adImage: reader.result});
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveNewLabel = async (product) => {
    // Quick optimistic UI update
    setProducts(products.map(p => p.id === product.id ? { ...p, isNew: false } : p));
    
    // Background sync to db
    const updatedProduct = { ...product, isNew: false };
    await productService.updateProduct(updatedProduct);
  };

  if (loading) return <div className="admin-dashboard"><div className="admin-loading">Loading Dashboard...</div></div>;

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const newProducts = products.filter(p => p.isNew).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening in your store.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Package size={24} /></div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-value">{products.length}</p>
          </div>
        </div>
        <div className="stat-card error">
          <div className="stat-icon"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <h3>Low / Out of Stock</h3>
            <p className="stat-value">{lowStockProducts.length + outOfStockProducts.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Sparkles size={24} /></div>
          <div className="stat-info">
            <h3>New Arrivals</h3>
            <p className="stat-value">{newProducts.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <h3>Store Status</h3>
            <p className="stat-value">Active</p>
          </div>
        </div>
      </div>

      <div className="dashboard-columns">
        {/* Left Column: Data Filters */}
        <div className="dashboard-col">
          
          <div className="dashboard-widget">
            <div className="widget-header">
              <h3><AlertTriangle size={18}/> Inventory Alerts</h3>
            </div>
            <div className="widget-content">
              {outOfStockProducts.length > 0 && (
                <div className="alert-group">
                  <h4>Out of Stock</h4>
                  <ul>
                    {outOfStockProducts.map(p => (
                      <li key={p.id}>
                        <Link to="/admin/products">{p.name}</Link> <span className="badge error">0 left</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {lowStockProducts.length > 0 && (
                <div className="alert-group">
                  <h4>Low Stock</h4>
                  <ul>
                    {lowStockProducts.map(p => (
                      <li key={p.id}>
                        <Link to="/admin/products">{p.name}</Link> <span className="badge warning">{p.stock} left</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
                <p className="text-muted">All products are well stocked!</p>
              )}
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="widget-header">
              <h3><Sparkles size={18}/> Recent "New" Labels</h3>
            </div>
            <div className="widget-content">
              {newProducts.length > 0 ? (
                <ul className="labeled-list">
                  {newProducts.slice(0, 5).map(p => (
                    <li key={p.id}>
                      <img src={p.images[0]} alt={p.name} />
                      <div className="labeled-info" style={{flex: 1}}>
                        <strong>{p.name}</strong>
                        <span>Labeled on: {new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveNewLabel(p)}
                        className="cta-button" 
                        style={{padding: '0.25rem 0.5rem', fontSize: '10px', color: 'var(--color-error)', borderColor: 'var(--color-error)'}}
                        title="Remove 'New' Label"
                      >
                        REMOVE
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No products marked as New.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Advertisement Config */}
        <div className="dashboard-col">
          <div className="dashboard-widget ad-widget">
            <div className="widget-header">
              <h3><Megaphone size={18}/> Storefront Advertisement Popup</h3>
            </div>
            <div className="widget-content">
              <p className="help-text" style={{marginBottom: '1rem'}}>
                Configure a promotional popup that appears when users visit the homepage.
              </p>
              {settings && (
                <form onSubmit={handleSaveAd} className="ad-form">
                  <label className="checkbox-label" style={{marginBottom: '1rem', display: 'flex'}}>
                    <input 
                      type="checkbox" 
                      checked={settings.adEnabled} 
                      onChange={(e) => setSettings({...settings, adEnabled: e.target.checked})}
                    />
                    <span style={{color: 'var(--color-white)'}}>Enable Advertisement Popup</span>
                  </label>

                  <div className="form-group">
                    <label>Advertisement Media (URL or Upload Image/Video)</label>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                      <input 
                        type="text" 
                        value={settings.adImage} 
                        onChange={(e) => setSettings({...settings, adImage: e.target.value})}
                        placeholder="Paste URL or upload a file ->"
                        disabled={!settings.adEnabled}
                        style={{flexGrow: 1}}
                      />
                      <label className="cta-button" style={{cursor: settings.adEnabled ? 'pointer' : 'not-allowed', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', margin: 0, opacity: settings.adEnabled ? 1 : 0.5, whiteSpace: 'nowrap'}}>
                        Upload File
                        <input 
                          type="file" 
                          accept="image/*,video/*" 
                          onChange={handleFileUpload} 
                          disabled={!settings.adEnabled}
                          style={{display: 'none'}} 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Link Destination (Product or Category)</label>
                    <select 
                      value={settings.adLinkProduct} 
                      onChange={(e) => setSettings({...settings, adLinkProduct: e.target.value})}
                      disabled={!settings.adEnabled}
                    >
                      <option value="">-- No Link (Just an Image) --</option>
                      
                      <optgroup label="Categories">
                        {categories.map(c => (
                          <option key={`cat_${c.id}`} value={`cat:${c.name}`}>[Category] {c.name}</option>
                        ))}
                      </optgroup>

                      <optgroup label="Products">
                        {products.map(p => (
                          <option key={`prod_${p.id}`} value={p.id}>{p.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="form-actions" style={{marginTop: '1rem'}}>
                    <button type="submit" className="cta-button primary full-width" disabled={savingAd}>
                      <Save size={18} style={{marginRight: '8px'}} />
                      {savingAd ? 'Saving...' : 'Save Advertisement'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="dashboard-widget ad-widget" style={{marginTop: '2rem'}}>
            <div className="widget-header">
              <h3><MessageCircle size={18}/> Contact Settings</h3>
            </div>
            <div className="widget-content">
              <p className="help-text" style={{marginBottom: '1rem'}}>
                Set the WhatsApp number that receives inquiries.
              </p>
              {settings && (
                <form onSubmit={handleSaveSettings} className="ad-form">
                  <div className="form-group">
                    <label>WhatsApp Number (Country Code + Number)</label>
                    <input 
                      type="text" 
                      value={settings.whatsappNumber || ''} 
                      onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value.replace(/[^0-9]/g, '')})}
                      placeholder="e.g. 919876543210"
                      style={{width: '100%'}}
                    />
                    <small className="help-text">Do not include the + sign.</small>
                  </div>
                  <div className="form-actions" style={{marginTop: '1rem'}}>
                    <button type="submit" className="cta-button primary full-width" disabled={savingSettings}>
                      <Save size={18} style={{marginRight: '8px'}} />
                      {savingSettings ? 'Saving...' : 'Save Contact Info'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
