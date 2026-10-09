import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { productService } from '../../backend/productService';
import '../../styles/PageInfo.css';

export default function Contact() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await productService.getSettings();
      if (res.success) {
        setSettings(res.data);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="info-page">
      <div className="info-container">
        <h1 className="info-title">Contact Us</h1>
        <div className="divider" style={{ margin: '0 auto 3rem' }}></div>
        
        <div className="info-content">
          <p className="lead-text" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            We're here to assist you with any inquiries regarding our collections, sizing, or styling advice.
          </p>

          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon"><MapPin size={28} /></div>
              <h3>Visit Our Store</h3>
              <p>Brand Store Anand<br />Anand, Gujarat<br />India</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon"><Phone size={28} /></div>
              <h3>Call or WhatsApp</h3>
              <p>
                {settings?.whatsappNumber ? `+${settings.whatsappNumber}` : '+91 98765 43210'}
                <br /><br />
                <a 
                  href={`https://wa.me/${settings?.whatsappNumber || '919876543210'}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cta-button primary"
                  style={{ display: 'inline-block', padding: '0.5rem 1rem', marginTop: '0.5rem' }}
                >
                  Message Us
                </a>
              </p>
            </div>

            <div className="contact-card">
              <div className="contact-icon"><Mail size={28} /></div>
              <h3>Email Us</h3>
              <p>{settings?.supportEmail || 'support@brandstore.com'}</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon"><Clock size={28} /></div>
              <h3>Opening Hours</h3>
              <p>Monday - Saturday<br />10:00 AM - 8:30 PM<br /><br />Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
