// Header.js
import React, { useEffect, useState } from 'react';
import { ROUTES } from '../constants';
import { SHOP_URL, STORE_ASSETS, STORE_CONTENT } from '../storeConstants';

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
        <a className="brand-mark" href="#top" aria-label={STORE_CONTENT.brand.homeLinkLabel}>
          <img className="brand-logo" src={STORE_ASSETS.logo} alt={STORE_CONTENT.brand.logoAlt} />
          <span className="brand-descriptor">
            {STORE_CONTENT.brand.descriptor}
            <small>{STORE_CONTENT.brand.tagline}</small>
          </span>
        </a>
        <nav className="header-nav" aria-label={STORE_CONTENT.header.navigationLabel}>
          <a href="#catalogue">{STORE_CONTENT.header.collectionLink}</a>
          <a href="#contact">{STORE_CONTENT.header.contactLink}</a>
          {showAdminLink && (
            <a href={ROUTES.adminDashboard} className="header-admin-link">
              {STORE_CONTENT.header.adminLink}
            </a>
          )}
          <a href={SHOP_URL} className="header-shop" target="_blank" rel="noreferrer">
            {STORE_CONTENT.header.shopLink}
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
