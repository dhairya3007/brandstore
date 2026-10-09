import React from 'react';
import '../../styles/PageInfo.css';

export default function About() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1 className="info-title">About Us</h1>
        <div className="divider" style={{ margin: '0 auto 3rem' }}></div>
        
        <div className="info-content">
          <p className="lead-text">
            Elevating men's fashion with premium quality and timeless designs.
          </p>
          
          <div className="about-grid">
            <div className="about-text">
              <p>
                Based in the heart of Anand, Gujarat, Brand Store Anand was founded with a single uncompromising mission: to provide the modern gentleman with apparel that exudes confidence, elegance, and superior craftsmanship.
              </p>
              <p>
                We believe that clothing is more than just fabric—it is an extension of your identity. That is why every piece in our collection is meticulously curated to ensure the perfect blend of contemporary style and classic sophistication. 
              </p>
              <p>
                From bespoke tailored jackets to the sharpest ethnic wear and premium footwear, we source only the finest materials to ensure that when you wear our brand, you feel the difference.
              </p>
            </div>
            
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800" alt="Premium Men's Fashion" />
            </div>
          </div>
          
          <div className="core-values">
            <h2>Our Core Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3>Quality</h3>
                <p>Uncompromising attention to detail and premium materials in every stitch.</p>
              </div>
              <div className="value-card">
                <h3>Elegance</h3>
                <p>Timeless designs that transcend fast fashion trends.</p>
              </div>
              <div className="value-card">
                <h3>Service</h3>
                <p>A personalized shopping experience tailored to your exact needs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
