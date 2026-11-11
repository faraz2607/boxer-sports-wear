// Footer.js
import React from 'react';
import { STORE_ASSETS, STORE_CONTENT } from '../storeConstants';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEnvelope, faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const openEmailApp = () => {
    window.location.href = `mailto:${STORE_CONTENT.footer.contactEmail}`;
  };

  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div className="footer-brand">
          <img src={STORE_ASSETS.logo} alt={STORE_CONTENT.brand.name} />
          <p>{STORE_CONTENT.footer.description}</p>
        </div>

        <div className="md:col-span-1">
          <h2 id="contact" className="text-lg md:text-xl font-bold mb-1 md:mb-4 text-left">
            {STORE_CONTENT.footer.contactHeading}
          </h2>
          <p className="text-dark-25 text-sm md:text-lg font-bold">
            {STORE_CONTENT.footer.emailLabel}{' '}
            <span
              onClick={openEmailApp}
              className="cursor-pointer font-normal hover:text-dark-35 hover:font-bold"
            >
              {STORE_CONTENT.footer.contactEmail}
            </span>
          </p>
        </div>

        <div className="md:col-span-1 flex flex-col items-baseline md:items-end">
          <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-4 text-center md:text-left">
            {STORE_CONTENT.footer.followHeading}
          </h2>
          <p>
            <i>{STORE_CONTENT.footer.followMessage}</i>
          </p>

          {/* <div className="flex space-x-4">    //------------------------> un-comment imports and below code for follow us icons 
            <a href="https://twitter.com/yourtwitter" className="">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
            <a href="https://facebook.com/yourfacebook" className="">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a href="https://instagram.com/yourinstagram" className="">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
          </div> */}
        </div>
      </div>

      <div className="page-container footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} {STORE_CONTENT.brand.name}.{' '}
          {STORE_CONTENT.footer.copyrightSuffix}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
