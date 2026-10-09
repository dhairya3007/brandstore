import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { productService } from '../backend/productService';
import '../styles/Navbar.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logo, setLogo] = useState('/logo.jpg');

  useEffect(() => {
    productService.getSettings().then(res => {
      if (res.success && res.data.storeLogo) setLogo(res.data.storeLogo);
    });
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="Brand Store Anand" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/shop" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Shop All</NavLink>
          <NavLink to="/collections/new" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>New Collection</NavLink>
          <NavLink to="/collections/featured" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Featured</NavLink>
          <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} style={{color: 'var(--color-gold)'}}>Admin Panel</NavLink>
        </nav>

        {/* Icons */}
        <div className="navbar-actions">
          {/* Search removed as requested */}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <NavLink to="/" onClick={closeMenu} className="mobile-nav-link">Home</NavLink>
          <NavLink to="/shop" onClick={closeMenu} className="mobile-nav-link">Shop All</NavLink>
          <NavLink to="/collections/new" onClick={closeMenu} className="mobile-nav-link">New Collection</NavLink>
          <NavLink to="/collections/featured" onClick={closeMenu} className="mobile-nav-link">Featured</NavLink>
          <NavLink to="/about" onClick={closeMenu} className="mobile-nav-link">About Us</NavLink>
          <NavLink to="/contact" onClick={closeMenu} className="mobile-nav-link">Contact</NavLink>
          <NavLink to="/admin/dashboard" onClick={closeMenu} className="mobile-nav-link" style={{color: 'var(--color-gold)'}}>Admin Panel</NavLink>
        </nav>
      </div>
    </header>
  );
}
