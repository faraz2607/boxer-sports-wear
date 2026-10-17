

// Header.js
import React from 'react';

const meeshoShopUrl = process.env.REACT_APP_MEESHO_SHOP_URL || 'https://www.meesho.com/';

const Header = () => {
  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <a className="brand-mark" href="#top" aria-label="Boxer Sports Wear home"><img className="brand-logo" src="/images/boxer-logo.jpeg" alt="Boxer" /><span className="brand-descriptor">SPORTS WEAR<small>MADE FOR EVERYDAY</small></span></a>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#catalogue">Our collection</a>
          <a href="#contact">Contact</a>
          <a href={meeshoShopUrl} className="header-shop" target="_blank" rel="noreferrer">Shop Meesho<span aria-hidden="true">&#8599;</span></a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
