import { useEffect, useState } from 'react';
import '../styles/BrandPreloader.css';

export default function BrandPreloader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Normal preloader sequence takes about 2.5s
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out transition
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`preloader ${!isVisible ? 'preloader-exit' : ''}`}>
      <div className="preloader-content">
        <div className="logo-wrapper">
          {/* Animated Gold Ring */}
          <svg
            className="gold-ring"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="48" />
          </svg>
          
          {/* The Original Logo */}
          <img
            src="/logo.jpg"
            alt="Brand Store Anand Logo"
            className="original-logo"
          />
        </div>
        
        <div className="brand-name">
          <h1>BRAND STORE</h1>
          <p>ANAND</p>
        </div>
        
        <div className="progress-line-container">
          <div className="progress-line"></div>
        </div>
      </div>
    </div>
  );
}
