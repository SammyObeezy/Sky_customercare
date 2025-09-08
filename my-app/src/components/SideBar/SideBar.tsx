import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { 
  TicketsIcon, 
  AddIcon, 
  ReportsIcon, 
  UsersIcon, 
  SettingsIcon, 
  CollapseIcon, 
  ExpandIcon 
} from '../Icons';
import './SideBar.css';

const SideBar: React.FC = () => {
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <nav className="sidebar-nav">
        <Link 
          to="/tickets" 
          className={`nav-item ${location.pathname === '/tickets' || location.pathname === '/' ? 'active' : ''}`}
          title="All Tickets"
        >
          <TicketsIcon />
          {!isCollapsed && <span className="nav-text">All Tickets</span>}
        </Link>

        <Link 
          to="/add-ticket" 
          className={`nav-item ${location.pathname === '/add-ticket' ? 'active' : ''}`}
          title="Create Ticket"
        >
          <AddIcon />
          {!isCollapsed && <span className="nav-text">Create Ticket</span>}
        </Link>

        <div className="nav-item" title="Reports">
          <ReportsIcon />
          {!isCollapsed && <span className="nav-text">Reports</span>}
        </div>

        <div className="nav-item" title="Users">
          <UsersIcon />
          {!isCollapsed && <span className="nav-text">Users</span>}
        </div>

        <div className="nav-item" title="Settings">
          <SettingsIcon />
          {!isCollapsed && <span className="nav-text">Settings</span>}
        </div>
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