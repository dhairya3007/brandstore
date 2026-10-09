import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PromoPopup from '../components/PromoPopup';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <PromoPopup />
    </div>
  );
}
