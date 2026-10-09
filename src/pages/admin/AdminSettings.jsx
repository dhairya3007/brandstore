import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { productService } from '../../backend/productService';
import '../../styles/AdminSettings.css';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: '',
    whatsappNumber: '',
    currency: '',
    supportEmail: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await productService.getSettings();
      if (res.success) {
        setSettings(res.data);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload a file smaller than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({...settings, storeLogo: reader.result});
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    const res = await productService.updateSettings(settings);
    if (res.success) {
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="admin-settings">
        <div className="admin-loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="admin-settings">
      <div className="admin-page-header">
        <div>
          <h1>Store Settings</h1>
          <p>Configure global preferences and contact details for your storefront.</p>
        </div>
      </div>

      <div className="settings-container">
        <form className="settings-form" onSubmit={handleSubmit}>
          
          <div className="settings-section">
            <h3>General Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Store Name</label>
                <input 
                  type="text" 
                  name="storeName" 
                  value={settings.storeName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group" style={{marginTop: '1.5rem'}}>
              <label>Store Logo (Replaces default logo everywhere)</label>
              <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                {settings.storeLogo ? (
                  <img src={settings.storeLogo} alt="Store Logo" style={{height: '60px', objectFit: 'contain', backgroundColor: 'var(--color-surface)', padding: '5px', borderRadius: '4px'}} />
                ) : (
                  <div style={{height: '60px', width: '60px', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '12px', color: 'var(--color-text-muted)'}}>No Logo</div>
                )}
                <label className="cta-button" style={{cursor: 'pointer', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', margin: 0, whiteSpace: 'nowrap', border: '1px solid var(--color-border)'}}>
                  Upload New Logo
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    style={{display: 'none'}} 
                  />
                </label>
                {settings.storeLogo && (
                  <button 
                    type="button" 
                    onClick={() => setSettings({...settings, storeLogo: ''})}
                    style={{color: 'var(--color-error)', textDecoration: 'underline', fontSize: 'var(--font-sm)'}}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Contact & Enquiries</h3>
            <div className="form-row">
              <div className="form-group">
                <label>WhatsApp Number (Include Country Code)</label>
                <input 
                  type="text" 
                  name="whatsappNumber" 
                  value={settings.whatsappNumber} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. 919876543210"
                />
                <span className="help-text">This number will receive customer inquiries.</span>
              </div>
              <div className="form-group">
                <label>Support Email</label>
                <input 
                  type="email" 
                  name="supportEmail" 
                  value={settings.supportEmail} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Store Policies</h3>
            <div className="form-group">
              <label>Available Policies (One per line)</label>
              <textarea 
                rows={5}
                value={(settings.storePolicies || []).join('\n')}
                onChange={(e) => setSettings({...settings, storePolicies: e.target.value.split('\n')})}
                placeholder="7 Days Return Policy&#10;Free Shipping over ₹1000&#10;100% Original Products"
                style={{width: '100%', resize: 'vertical', padding: '10px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '4px'}}
              />
              <span className="help-text">These policies will be available to select when adding/editing products.</span>
            </div>
          </div>

          <div className="settings-actions">
            {message && <span className="success-message">{message}</span>}
            <button type="submit" className="cta-button primary save-btn" disabled={saving}>
              <Save size={18} style={{marginRight: '8px'}} /> 
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
