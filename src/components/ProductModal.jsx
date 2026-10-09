import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '../backend/productService';
import '../styles/ProductModal.css';

export default function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
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

  useEffect(() => {
    if (product) {
      if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
      if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
      setActiveImage(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }
  }

  const handleNextImage = () => {
    setActiveImage(prev => (prev === product?.images.length - 1 ? 0 : prev + 1));
  }

  const handlePrevImage = () => {
    setActiveImage(prev => (prev === 0 ? product?.images.length - 1 : prev - 1));
  }

  if (!product) return null;

  const handleWhatsAppInquiry = () => {
    const number = settings?.whatsappNumber || '919876543210';
    const storeName = settings?.storeName || 'Brand Store';
    let text = `Hello ${storeName},\n\nI would like to inquire about this product:\n`;
    text += `*${product.name}*\n`;
    text += `SKU: ${product.sku}\n`;
    if (product.salePrice) {
      text += `Price: ₹${product.salePrice}\n`;
    } else {
      text += `Price: ₹${product.price}\n`;
    }
    
    if (selectedSize) text += `\n*Selected Size:* ${selectedSize}`;
    if (selectedColor) text += `\n*Selected Color:* ${selectedColor}`;
    
    text += `\n\nPlease let me know if this is available for purchase!`;
    
    const mainImage = product.images[0];
    if (mainImage && mainImage.startsWith('http')) {
      text += `\n\nProduct Image: ${mainImage}`;
    }
    
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className="modal-content-grid">
          {/* Image Gallery */}
          <div className="modal-gallery">
            <div 
              className="modal-main-image"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img src={product.images[activeImage]} alt={product.name} />
              
              {product.images.length > 1 && (
                <>
                  <button 
                    className="image-nav-btn prev"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    className="image-nav-btn next"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="image-dots">
                    {product.images.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`image-dot ${activeImage === idx ? 'active' : ''}`}
                        onClick={() => setActiveImage(idx)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="modal-info-panel">
            <div className="modal-info-scroll">
              {product.isNew && <span className="badge new">NEW ARRIVAL</span>}
              <h2 className="modal-title">{product.name}</h2>
              <p className="modal-sku">SKU: {product.sku}</p>

              <div className="modal-price-large">
                {product.salePrice ? (
                  <>
                    <span className="price sale">₹{product.salePrice}</span>
                    <span className="price original">₹{product.price}</span>
                  </>
                ) : (
                  <span className="price">₹{product.price}</span>
                )}
              </div>

              <div className="modal-description">
                <p>{product.description}</p>
              </div>

              {/* Variants */}
              {product.colors && product.colors.length > 0 && (
                <div className="modal-variant-group">
                  <span className="modal-variant-label">Color: <strong>{selectedColor}</strong></span>
                  <div className="modal-variant-options">
                    {product.colors.map(color => (
                      <button 
                        key={color}
                        className={`modal-variant-btn ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="modal-variant-group">
                  <span className="modal-variant-label">Size: <strong>{selectedSize}</strong></span>
                  <div className="modal-variant-options">
                    {product.sizes.map(size => (
                      <button 
                        key={size}
                        className={`modal-variant-btn ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.policies && product.policies.length > 0 && (
                <div className="modal-policies-group" style={{marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)'}}>
                  <h4 style={{fontSize: 'var(--font-sm)', fontWeight: '400', letterSpacing: '0.1em', marginBottom: '10px', color: 'var(--color-gold)'}}>STORE POLICIES</h4>
                  <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    {product.policies.map((policy, idx) => (
                      <li key={idx} style={{fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{color: 'var(--color-gold)'}}>•</span> {policy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sticky WhatsApp Button at the bottom of the modal info panel */}
            <div className="modal-action-sticky">
              <button className="cta-button primary full-width" onClick={handleWhatsAppInquiry}>
                ENQUIRE ON WHATSAPP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
