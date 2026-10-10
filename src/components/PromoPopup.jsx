import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { productService } from '../backend/productService';
import '../styles/PromoPopup.css';

export default function PromoPopup() {
  const [show, setShow] = useState(false);
  const [adConfig, setAdConfig] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPromo = async () => {
      // Check if user already closed it this session
      if (sessionStorage.getItem('promoClosed')) return;

      const res = await productService.getSettings();
      if (res.success && res.data && res.data.adEnabled && res.data.adImage) {
        setAdConfig(res.data);
        // Add a slight delay so it pops up after the site loads
        setTimeout(() => setShow(true), 2000);
      }
    };
    checkPromo();
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('promoClosed', 'true');
  };

  const handleImageClick = () => {
    if (adConfig.adLinkProduct) {
      handleClose();
      if (adConfig.adLinkProduct.startsWith('cat:')) {
        const catName = adConfig.adLinkProduct.replace('cat:', '');
        navigate(`/shop?category=${encodeURIComponent(catName)}`);
      } else {
        navigate(`/shop?product=${adConfig.adLinkProduct}`);
      }
    }
  };

  if (!show || !adConfig) return null;

  const isClickable = !!adConfig.adLinkProduct;
  const isVideo = adConfig.adImage && (
    adConfig.adImage.startsWith('data:video') || 
    adConfig.adImage.match(/\.(mp4|webm|ogg)$/i)
  );

  return (
    <div className="promo-overlay">
      <div className="promo-modal">
        <button className="promo-close-btn" onClick={handleClose} aria-label="Close Advertisement">
          <X size={24} />
        </button>
        <div 
          className={`promo-image-container ${isClickable ? 'clickable' : ''}`}
          onClick={isClickable ? handleImageClick : undefined}
        >
          {isVideo ? (
            <video 
              src={adConfig.adImage} 
              autoPlay 
              muted 
              loop 
              playsInline 
              style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} 
            />
          ) : (
            <img src={adConfig.adImage} alt="Special Promotion" />
          )}
        </div>
      </div>
    </div>
  );
}
