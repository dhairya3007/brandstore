import { useState } from 'react';
import { Download, UploadCloud, AlertCircle, Database } from 'lucide-react';
import '../../styles/AdminBackup.css';

const DB_KEY = 'brandstore_db';

export default function AdminBackup() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDownload = () => {
    try {
      const dbStr = localStorage.getItem(DB_KEY);
      if (!dbStr) {
        setError('No data found to backup.');
        return;
      }
      
      const date = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const filename = `brandstore_backup_${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}.json`;
      
      const blob = new Blob([dbStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage('Backup downloaded successfully.');
      setError('');
    } catch (err) {
      setError('Failed to download backup: ' + err.message);
      setMessage('');
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setError('Please select a valid JSON backup file.');
      setMessage('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        // Validate JSON structure
        const parsed = JSON.parse(content);
        if (!parsed.products || !parsed.categories) {
          throw new Error('Invalid backup file format. Expected a BrandStore backup file.');
        }
        
        // Overwrite the local database
        localStorage.setItem(DB_KEY, JSON.stringify(parsed));
        
        setMessage('Backup restored successfully! Reloading...');
        setError('');
        
        // Force reload the page to refresh all application state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        setError('Failed to restore backup: ' + err.message);
        setMessage('');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="admin-backup">
      <div className="admin-page-header">
        <div>
          <h1>Data Backup & Restore</h1>
          <p>Export your store data or restore from a previous backup.</p>
        </div>
      </div>

      <div className="backup-container">
        {message && <div className="backup-alert success">{message}</div>}
        {error && <div className="backup-alert error"><AlertCircle size={18}/> {error}</div>}

        <div className="backup-cards">
          {/* Export Card */}
          <div className="backup-card">
            <div className="card-icon">
              <Download size={32} />
            </div>
            <h3>Export Data</h3>
            <p>Download a complete snapshot of your store's inventory, categories, settings, and advertisement configurations.</p>
            <p className="help-text">The file will be named with the current date and time.</p>
            
            <button className="cta-button primary full-width" onClick={handleDownload} style={{marginTop: 'auto'}}>
              <Download size={18} style={{marginRight: '8px'}} />
              Download Backup File
            </button>
          </div>

          {/* Import Card */}
          <div className="backup-card">
            <div className="card-icon restore-icon">
              <UploadCloud size={32} />
            </div>
            <h3>Restore Data</h3>
            <p>Upload a previously exported backup file to restore your store to that exact state.</p>
            <p className="help-text warning-text"><AlertCircle size={12}/> Warning: This will overwrite your current data.</p>
            
            <label className="cta-button full-width upload-label" style={{marginTop: 'auto', textAlign: 'center', justifyContent: 'center'}}>
              <UploadCloud size={18} style={{marginRight: '8px'}} />
              Upload & Restore
              <input 
                type="file" 
                accept=".json,application/json" 
                onChange={handleUpload} 
                style={{display: 'none'}} 
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
