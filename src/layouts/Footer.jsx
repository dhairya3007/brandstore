import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../backend/productService';
import '../styles/Footer.css';

export default function Footer() {
  const [logo, setLogo] = useState('/logo.jpg');

  useEffect(() => {
    productService.getSettings().then(res => {
      if (res.success && res.data.storeLogo) setLogo(res.data.storeLogo);
    });
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src={logo} alt="Brand Store Anand" className="footer-logo" />
          <h2 className="footer-title">BRAND STORE ANAND</h2>
          <p className="footer-desc">Premium men's fashion and luxury wear.</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-col">
            <h3>Shop</h3>
            <Link to="/shop">All Products</Link>
            <Link to="/collections/new">New Arrivals</Link>
            <Link to="/collections/featured">Featured</Link>
          </div>
          
          <div className="footer-col">
            <h3>Support</h3>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">WhatsApp Enquiry</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Brand Store Anand. All rights reserved.</p>
      </div>
    </footer>
  );
}
