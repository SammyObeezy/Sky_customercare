import React from 'react';
import './OData.css';

const OData: React.FC = () => {
  return (
    <div className="odata-page">
      <div className="page-header-section">
        <div className="page-header-content">
          <h1>OData</h1>
        </div>
        <hr className="page-divider" />
      </div>
      
      <div className="odata-container">
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z" stroke="#135764" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8v8" stroke="#135764" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12h8" stroke="#135764" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>OData Integration</h3>
          <p>This feature will be implemented soon.</p>
        </div>
      </div>
    </div>
  );
};

export default OData;