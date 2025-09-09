import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TableManager, { TableColumn } from '../../components/TableManager/TableManager';
import './TicketList.css';

// Mock data
const mockTickets = [
  {
    id: 1,
    ticketSubject: 'Addition of Guarantors to Loan Module',
    ticketStatus: 'Open',
    source: 'Email',
    dateRequested: '2024-05-06 12:00:00'
  },
  {
    id: 2,
    ticketSubject: 'Reset Password',
    ticketStatus: 'Resolved',
    source: 'Email',
    dateRequested: '2024-05-07 12:00:00'
  },
  {
    id: 3,
    ticketSubject: 'Portal Rights Requisition',
    ticketStatus: 'Closed',
    source: 'Email',
    dateRequested: '2024-05-08 12:00:00'
  },
  {
    id: 4,
    ticketSubject: 'Addition of SHA Insurance',
    ticketStatus: 'In Progress',
    source: 'Help Desk System',
    dateRequested: '2024-05-10 12:00:00'
  }
];

const TicketList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all-tickets');
  const [activeFilter, setActiveFilter] = useState('all');

  // Define table columns
  const columns: TableColumn[] = [
    {
      id: 'id',
      caption: 'Ticket ID',
      filterable: true,
      sortable: true,
      size: 100,
      align: 'center'
    },
    {
      id: 'ticketSubject',
      caption: 'Ticket Subject',
      filterable: true,
      sortable: true,
      size: 300,
      render: (row) => (
        <a href={`/ticket/${row.id}`} style={{ color: '#3498db', textDecoration: 'underline' }}>
          {row.ticketSubject}
        </a>
      )
    },
    {
      id: 'ticketStatus',
      caption: 'Ticket Status',
      filterable: true,
      sortable: true,
      size: 120,
      align: 'center',
      render: (row) => (
        <span>{row.ticketStatus}</span>
      )
    },
    {
      id: 'source',
      caption: 'Source',
      filterable: true,
      sortable: true,
      size: 120,
      align: 'center'
    },
    {
      id: 'dateRequested',
      caption: 'Date Requested',
      filterable: true,
      sortable: true,
      size: 160,
      align: 'center'
    }
  ];

  return (
    <div className="ticket-list-page">
      {/* Tab Navigation */}
      <div className="ticket-tabs">
        <button
          className={`tab-button ${activeTab === 'all-tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('all-tickets')}
        >
          All Tickets
        </button>
        <div className="tab-header-section">
          <h2>All Tickets</h2>
          <Link to="/add-ticket" className="add-ticket-btn">
            Add Ticket
          </Link>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'all-tickets' && (
          <div className="ticket-content-layout">
            {/* Left Sidebar - Filters */}
            <div className="ticket-filter-sidebar">
             

              <div className="filter-list">
                <button
                  className={`filter-item ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                   <div className="status-dot status-all"></div>
                  <span>All</span>
                  <span className="count">0</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'open' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('open')}
                >
                  <div className="status-dot status-open"></div>
                  <span>Open</span>
                  <span className="count">0</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'in-progress' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('in-progress')}
                >
                  <div className="status-dot status-in-progress"></div>
                  <span>In Progress</span>
                  <span className="count">0</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'resolved' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('resolved')}
                >
                  <div className="status-dot status-resolved"></div>
                  <span>Resolved</span>
                  <span className="count">0</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'closed' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('closed')}
                >
                  <div className="status-dot status-closed"></div>
                  <span>Closed</span>
                  <span className="count">0</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'dropped' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('dropped')}
                >
                  <div className="status-dot status-dropped"></div>
                  <span>Dropped</span>
                  <span className="count">0</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'on-hold' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('on-hold')}
                >
                  <div className="status-dot status-on-hold"></div>
                  <span>On Hold</span>
                  <span className="count">0</span>
                </button>
              </div>
            </div>

            {/* Right Side - Just the Table */}
            <div className="ticket-table-section">
              <div className="ticket-table-container">
                <TableManager
                  data={mockTickets}
                  columns={columns}
                  rowsPerPage={8}
                  emptyMessage="No tickets found."
                  className="tickets-table-manager"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;