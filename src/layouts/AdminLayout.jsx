import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut, Database } from 'lucide-react';
import { productService } from '../backend/productService';
import '../styles/AdminLayout.css';

export default function AdminLayout() {
  const [logo, setLogo] = useState('/logo.jpg');

  useEffect(() => {
    productService.getSettings().then(res => {
      if (res.success && res.data.storeLogo) setLogo(res.data.storeLogo);
    });
  }, []);

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-brand">
            <img src={logo} alt="Brand Logo" className="admin-logo" />
            <span className="admin-brand-text">Admin</span>
          </Link>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'} end>
            <LayoutDashboard size={20} className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/products" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <Package size={20} className="nav-icon" />
            <span className="nav-text">Products</span>
          </NavLink>
          <NavLink to="/admin/categories" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <LayoutDashboard size={20} className="nav-icon" />
            <span className="nav-text">Categories</span>
          </NavLink>
          <NavLink to="/admin/settings" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <Settings size={20} className="nav-icon" />
            <span className="nav-text">Settings</span>
          </NavLink>
          <NavLink to="/admin/backup" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <Database size={20} className="nav-icon" />
            <span className="nav-text">Backup</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link logout">
            <LogOut size={20} className="nav-icon" />
            <span className="nav-text">Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-breadcrumb">
            Admin Panel
          </div>
          <div className="admin-user">
            <div className="admin-avatar">A</div>
            <span>Admin User</span>
          </div>
        </div>
        
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
