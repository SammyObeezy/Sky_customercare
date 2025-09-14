import React from 'react';
// Import Link and useNavigate from TanStack Router
import { Link, useNavigate } from '@tanstack/react-router';
import { useSidebar } from '../../contexts/SidebarContext';
import { useUser } from '../../contexts/UserContext';
import {
  TicketsIcon,
  ReportsIcon,
  UsersIcon,
  SettingsIcon,
  ScanIcon,
  OfficeIcon,
  CollapseIcon,
  ExpandIcon,
} from '../Icons'; // Corrected the relative path for icons
import './SideBar.css';

// OData SVG Icon
const ODataIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Logout SVG Icon
const LogoutIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate({ to: '/auth/login' });
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <nav className="sidebar-nav">
        {/* Dashboard Link */}
        <Link
          to="/"
          className="nav-item"
          activeProps={{ className: 'nav-item active' }}
          title="Dashboard"
        >
         <TicketsIcon />
          {!isCollapsed && <span className="nav-text">Dashboard</span>}
        </Link>
        
        {/* Tickets Link */}
        <Link
          to="/ticket-list"
          className="nav-item"
          activeProps={{ className: 'nav-item active' }}
          title="All Tickets"
        >
           <ReportsIcon />
          {!isCollapsed && <span className="nav-text">All Tickets</span>}
        </Link>

        {/* <Link
          to="/add-ticket"
          className="nav-item"
          activeProps={{ className: 'nav-item active' }}
          title="Create Ticket"
        >
          <ReportsIcon />
          {!isCollapsed && <span className="nav-text">Create Ticket</span>}
        </Link> */}

        <div className="nav-item" title="Reports">
          <ScanIcon />
          {!isCollapsed && <span className="nav-text">Reports</span>}
        </div>

        <div className="nav-item" title="Calendar">
          <OfficeIcon />
          {!isCollapsed && <span className="nav-text">Calendar</span>}
        </div>

        <div className="nav-item" title="Tasks">
          <UsersIcon />
          {!isCollapsed && <span className="nav-text">Tasks</span>}
        </div>

        <Link
          to="/odata"
          className="nav-item"
          activeProps={{ className: 'nav-item active' }}
          title="OData"
        >
          <ODataIcon />
          {!isCollapsed && <span className="nav-text">OData</span>}
        </Link>

        <div className="nav-item" title="Settings">
          <SettingsIcon />
          {!isCollapsed && <span className="nav-text">Settings</span>}
        </div>

        <button
          className="nav-item logout-btn"
          title="Logout"
          onClick={handleLogout}
        >
          <LogoutIcon />
          {!isCollapsed && <span className="nav-text">Logout</span>}
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button
          className="nav-item collapse-btn"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          {!isCollapsed && <span className="nav-text">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;