import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BrandPreloader from './components/BrandPreloader';
// Public Pages
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSettings from './pages/admin/AdminSettings';
import AdminBackup from './pages/admin/AdminBackup';

function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <>
      {!preloaderComplete && <BrandPreloader onComplete={() => setPreloaderComplete(true)} />}
      
      {preloaderComplete && (
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/collections/new" element={<Shop />} />
              <Route path="/collections/featured" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="backup" element={<AdminBackup />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
