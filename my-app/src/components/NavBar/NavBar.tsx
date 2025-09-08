import React from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { SupportIcon, SearchIcon, AddIcon, NotificationIcon, SelectDropdownIcon, UserIcon } from '../Icons';
import './NavBar.css';

const NavBar: React.FC = () => {
  const { isCollapsed } = useSidebar();

  return (
    <nav className="navbar">
      <div className={`navbar-support ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <SupportIcon />
        {!isCollapsed && <span className="support-text">Support</span>}
      </div>

      <div className="navbar-main">
        <div className="navbar-left">
          <div className="navbar-brand">

            <span className="brand-text">Help Desk - Sky World Limited</span>
            <span className="version-badge">VENDOR</span>
          </div>
        </div>



        <div className="navbar-right">
          <Link to="/add-ticket" className="nav-button" title="Add new">
            <AddIcon />
          </Link>

          <button className="nav-button" title="Search">
            <SearchIcon />
          </button>

          <div className="company-selector">
            <div className="custom-select">
              <span className="company-name">Amstar SACCO Limited</span>
              <div className="select-icon">
                <SelectDropdownIcon />
              </div>
              <select className="company-select">
                <option value="skyworld">Amstar SACCO Limited</option>
                <option value="other">Other Company</option>
              </select>
            </div>
          </div>
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