import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="left-0 w-full bg-white py-4 border-t border-gray-300 z-0">
      <div className="flex justify-between items-center px-8">
        <p className="text-gray-700">Dash Spend</p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-700"><FontAwesomeIcon icon={faFacebook} /></a>
          <a href="#" className="text-gray-700"><FontAwesomeIcon icon={faLinkedin} /></a>
          <a href="#" className="text-gray-700"><FontAwesomeIcon icon={faYoutube} /></a>
          <a href="#" className="text-gray-700"><FontAwesomeIcon icon={faInstagram} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
