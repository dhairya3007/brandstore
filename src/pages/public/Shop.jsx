import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productService } from '../../backend/productService';
import ProductModal from '../../components/ProductModal';
import '../../styles/Shop.css';

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q');
  const targetProductId = searchParams.get('product');
  const urlCategory = searchParams.get('category');

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Filtering state
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'All');
  const [sortBy, setSortBy] = useState('newest');

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

  // Sync category from URL
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    } else if (location.pathname === '/shop' && !urlCategory) {
      setActiveCategory('All');
    }
  }, [urlCategory, location.pathname]);

  // Determine context based on URL
  const isNew = location.pathname.includes('/new');
  const isFeatured = location.pathname.includes('/featured');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [resProd, resCat] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);

      if (resCat.success) {
        setCategories([{ id: 'all', name: 'All' }, ...resCat.data]);
      }

      if (resProd.success) {
        let products = resProd.data.filter(p => p.isActive !== false);
        
        // Initial filtering based on route
        if (isNew) products = products.filter(p => p.isNew);
        if (isFeatured) products = products.filter(p => p.isFeatured);
        
        setAllProducts(products);
        setFilteredProducts(products);
      }
      setLoading(false);
    };
    fetchData();
  }, [location.pathname, isNew, isFeatured]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeCategory && activeCategory.toLowerCase() !== 'all') {
       const selectedCat = categories.find(c => c.name.toLowerCase().trim() === activeCategory.toLowerCase().trim());
       if(selectedCat) {
         result = result.filter(p => p.categoryId === selectedCat.id || (p.categoryId && p.categoryId.toLowerCase() === selectedCat.name.toLowerCase()));
       } else if (categories.length > 1) {
         // If categories loaded but not found, show none
         result = [];
       }
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name-a-z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(result);
  }, [allProducts, activeCategory, sortBy, searchQuery, categories]);

  // Handle direct product linking via URL
  useEffect(() => {
    if (targetProductId && allProducts.length > 0) {
      const p = allProducts.find(x => x.id === targetProductId);
      if (p) {
        setSelectedProduct(p);
      }
    }
  }, [targetProductId, allProducts]);

  let pageTitle = "ALL PRODUCTS";
  if (isNew) pageTitle = "NEW COLLECTION";
  if (isFeatured) pageTitle = "FEATURED PRODUCTS";

  return (
    <div className="shop-page">
      <div className="shop-container">
        {/* Top Toolbar Filters */}
        {/* Top Toolbar Filters */}
        <div className="shop-toolbar">
          <div className="toolbar-categories">
            <ul className="filter-list horizontal">
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    className={`filter-btn ${activeCategory && activeCategory.toLowerCase() === cat.name.toLowerCase() ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      if (cat.name === 'All') {
                        navigate('/shop');
                      } else {
                        navigate(`/shop?category=${encodeURIComponent(cat.name)}`);
                      }
                    }}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="toolbar-sort">
            <span className="sort-label">SORT BY:</span>
            <select 
              className="sort-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <main className="shop-main">
          {loading ? (
            <div className="loading-state">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <h2>No products found</h2>
              <p>Try adjusting your filters or checking back later.</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
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
        </main>
      </div>

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
