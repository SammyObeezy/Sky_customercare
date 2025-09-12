import React, { useEffect } from 'react';
// Changed from 'react-router-dom' to '@tanstack/react-router'
import { Link, useLocation } from '@tanstack/react-router';
import { useSidebar } from '../../contexts/SidebarContext';
import { useUser } from '../../contexts/UserContext';
import {
  SupportIcon,
  SearchIcon,
  AddIcon,
  NotificationIcon,
  UserIcon,
  SelectDropdownIcon
} from '../Icons'; // Assuming Icons component is in the right path
import './NavBar.css';

const NavBar: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const { userType, companyName, setUserType, setCompanyName } = useUser();
  // useLocation now comes from TanStack Router
  const location = useLocation();

  // This logic remains the same
  useEffect(() => {
    // The path is now correctly referenced from our file structure
    if (location.pathname === '/add-ticket') {
      setUserType('client');
      setCompanyName('Njiwa SACCO');
    } else {
      setUserType('admin');
      setCompanyName('Sky World Limited');
    }
  }, [location.pathname, setUserType, setCompanyName]);

  const getBrandText = () => {
    if (userType === 'client') {
      return `Help Desk - ${companyName}`;
    }
    return `Help Desk - ${companyName}`;
  };

  const getVersionBadge = () => {
    if (userType === 'client') {
      return 'CLIENT';
    }
    return 'VENDOR';
  };

  const showCompanySelector = location.pathname !== '/add-ticket';

  return (
    <nav className="navbar">
      <div className={`navbar-support ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <SupportIcon />
        {!isCollapsed && <span className="support-text">Support</span>}
      </div>

      <div className="navbar-main">
        <div className="navbar-left">
          <div className="navbar-brand">
            <span className="brand-text">{getBrandText()}</span>
            <span className="version-badge">{getVersionBadge()}</span>
          </div>
        </div>
        
        <div className="navbar-right">
          {/* Link now comes from TanStack Router and is type-safe */}
          <Link to="/add-ticket" className="nav-button" title="Add new">
            <AddIcon />
          </Link>

          <button className="nav-button" title="Search">
            <SearchIcon />
          </button>

          {showCompanySelector && (
            <div className="company-selector">
              <div className="custom-select">
                <span className="company-name">Amstar SACCO Limited</span>
                <div className="select-icon">
                  <SelectDropdownIcon />
                </div>
                <select className="company-select">
                  <option value="amstar">Amstar SACCO Limited</option>
                  <option value="other">Other Company</option>
                </select>
              </div>
            </div>
          )}

          <button className="nav-button" title="Notifications">
            <NotificationIcon />
          </button>

          <div className="user-menu">
            <button className="user-avatar">
              <UserIcon />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;