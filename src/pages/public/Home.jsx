import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../backend/productService';
import ProductModal from '../../components/ProductModal';
import '../../styles/Home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [heroProducts, setHeroProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleInquiry = async (e, product) => {
    e.stopPropagation();
    const res = await productService.getSettings();
    const settings = res.success ? res.data : {};
    const number = settings.whatsappNumber || '919876543210';
    const storeName = settings.storeName || 'Brand Store';
    let text = `Hello ${storeName},\n\nI would like to inquire about this product:\n`;
    text += `*${product.name}*\n`;
    text += `SKU: ${product.sku}\n`;
    text += `Price: ₹${product.salePrice || product.price}\n`;
    text += `\nPlease let me know if this is available!`;
    const mainImage = product.images[0];
    if (mainImage && mainImage.startsWith('http')) {
      text += `\n\nProduct Image: ${mainImage}`;
    }
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await productService.getProducts();
      if (res.success) {
        const activeProducts = res.data.filter(p => p.isActive !== false);
        setFeaturedProducts(activeProducts.filter(p => p.isFeatured));
        
        // Get up to 6 latest 'New' products for the slider
        const newProducts = activeProducts
          .filter(p => p.isNew)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
          
        setHeroProducts(newProducts);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (heroProducts.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % heroProducts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroProducts.length]);

  return (
    <div className="home-page">
      <section className="hero">
        {heroProducts.length > 0 ? (
          <div className="hero-slider">
            {heroProducts.map((product, idx) => (
              <div 
                key={product.id} 
                className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
              >
                <div className="hero-bg-blur" style={{ backgroundImage: `url(${product.images[0]})` }}></div>
                <div className="hero-bg-overlay"></div>
                <img className="hero-main-img" src={product.images[0]} alt={product.name} />
              </div>
            ))}
            {/* Optional Slider Indicators */}
            {heroProducts.length > 1 && (
              <div className="hero-indicators">
                {heroProducts.map((_, idx) => (
                  <button 
                    key={idx} 
                    className={`indicator ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="hero-slider fallback" />
        )}
        
        <div className="hero-content">
          <h1>ELEVATE YOUR STYLE</h1>
          <p>Discover the finest collection of premium menswear.</p>
          <Link to="/shop" className="cta-button primary">SHOP THE COLLECTION</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>FEATURED COLLECTION</h2>
          <div className="divider"></div>
        </div>

        {loading ? (
          <div className="loading-state">Loading latest styles...</div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card" 
                onClick={() => setSelectedProduct(product)}
              >
                <div className="product-image-wrapper">
                  {product.isNew && <span className="badge new">NEW</span>}
                  <img src={product.images[0]} alt={product.name} loading="lazy" />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="price-row">
                    <div className="price-container">
                      {product.salePrice ? (
                        <>
                          <span className="price sale">₹{product.salePrice}</span>
                          <span className="price original">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="price">₹{product.price}</span>
                      )}
                    </div>
                    <button 
                      className="inquiry-btn-small" 
                      onClick={(e) => handleInquiry(e, product)}
                      aria-label={`Inquire about ${product.name}`}
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}
