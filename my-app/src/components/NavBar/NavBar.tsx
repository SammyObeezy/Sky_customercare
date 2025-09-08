import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { useUser } from '../../contexts/UserContext';
import { 
  SupportIcon, 
  SearchIcon, 
  AddIcon, 
  NotificationIcon, 
  UserIcon,
  SelectDropdownIcon 
} from '../Icons';
import './NavBar.css';

const NavBar: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const { userType, companyName, setUserType, setCompanyName } = useUser();
  const location = useLocation();

  // Set user type and company based on current route
  useEffect(() => {
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