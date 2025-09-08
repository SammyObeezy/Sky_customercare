import React from 'react';
import { BuildingIcon, PersonIcon } from '../Icons';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-item">
          <BuildingIcon />
          <span>Sky World Limited</span>
        </div>
        
        <div className="footer-item">
          <PersonIcon />
          <span>Jane Doe</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;