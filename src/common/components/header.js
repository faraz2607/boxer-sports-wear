// Header.js
import React, { useEffect, useState } from 'react';
import { ROUTES, SHOP_URL } from '../siteConfig';

const Header = () => {
  const [showAdminLink, setShowAdminLink] = useState(
    window.location.hash === ROUTES.adminReturnHash,
  );
  useEffect(() => {
    const updateAdminLink = () => {
      if (window.location.hash === ROUTES.adminReturnHash) setShowAdminLink(true);
    };
    window.addEventListener('hashchange', updateAdminLink);
    return () => window.removeEventListener('hashchange', updateAdminLink);
  }, []);
  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <a className="brand-mark" href="#top" aria-label="Boxer Sports Wear home">
          <img className="brand-logo" src="/images/boxer-logo.jpeg" alt="Boxer" />
          <span className="brand-descriptor">
            SPORTS WEAR<small>MADE FOR EVERYDAY</small>
          </span>
        </a>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#catalogue">Our collection</a>
          <a href="#contact">Contact</a>
          {showAdminLink && (
            <a href={ROUTES.adminDashboard} className="header-admin-link">
              Go to Admin
            </a>
          )}
          <a href={SHOP_URL} className="header-shop" target="_blank" rel="noreferrer">
            Shop Meesho
            <span aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
