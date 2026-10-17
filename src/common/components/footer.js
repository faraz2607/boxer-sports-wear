// Footer.js
import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEnvelope, faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const openEmailApp = () => {
    window.location.href = 'mailto:sportswear.boxer@gmail.com';
  };

  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div className="footer-brand"><img src="/images/boxer-logo.jpeg" alt="Boxer Sports Wear" /><p>Everyday essentials, from lowers and T-shirts to stolas, gamchas, Arabic rumals, and shemaghs.</p></div>

        <div className="md:col-span-1">
          <h2 id='contact' className="text-lg md:text-xl font-bold mb-1 md:mb-4 text-left">Contact Us</h2>
          <p className='text-dark-25 text-sm md:text-lg font-bold'>Email: <span onClick={openEmailApp} className="cursor-pointer font-normal hover:text-dark-35 hover:font-bold">sportswear.boxer@gmail.com</span></p>
        </div>

        <div className="md:col-span-1 flex flex-col items-baseline md:items-end">
          <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-4 text-center md:text-left">Follow Us</h2>
          <p><i>Coming soon...</i></p>
          
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
        <p>&copy; {(new Date().getFullYear())} Boxer Sports Wear. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
