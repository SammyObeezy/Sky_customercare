import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import TableManager, { TableColumn } from '../../components/TableManager/TableManager';
import { useTickets } from '../../contexts/TicketsContext';
import './TicketList.css';

const TicketList: React.FC = () => {
  const { tickets, getTicketCounts } = useTickets();
  const [activeTab, setActiveTab] = useState('all-tickets');
  const [activeFilter, setActiveFilter] = useState('all');

  const ticketCounts = getTicketCounts();

  // Sort tickets by dateRequested (newest first) and then filter
  const filteredTickets = useMemo(() => {
  // First sort all tickets by ID (lowest first)
  const sortedTickets = [...tickets].sort((a, b) => {
    return a.id - b.id; // Ascending order (lowest ID first)
  });

  // Then apply filter
  if (activeFilter === 'all') return sortedTickets;
  
  const filterMap: Record<string, string> = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed',
    'dropped': 'Dropped',
    'on-hold': 'On Hold'
  };
  
  return sortedTickets.filter(ticket => 
    ticket.ticketStatus === filterMap[activeFilter]
  );
}, [tickets, activeFilter]);

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
      align: 'center',
      render: (row) => {
        const date = new Date(row.dateRequested);
        return (
          <span>{date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        );
      }
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
                  <span className="count">{ticketCounts.all || 0}</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'open' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('open')}
                >
                  <div className="status-dot status-open"></div>
                  <span>Open</span>
                  <span className="count">{ticketCounts.open || 0}</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'in-progress' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('in-progress')}
                >
                  <div className="status-dot status-in-progress"></div>
                  <span>In Progress</span>
                  <span className="count">{ticketCounts['in-progress'] || 0}</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'resolved' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('resolved')}
                >
                  <div className="status-dot status-resolved"></div>
                  <span>Resolved</span>
                  <span className="count">{ticketCounts.resolved || 0}</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'closed' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('closed')}
                >
                  <div className="status-dot status-closed"></div>
                  <span>Closed</span>
                  <span className="count">{ticketCounts.closed || 0}</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'dropped' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('dropped')}
                >
                  <div className="status-dot status-dropped"></div>
                  <span>Dropped</span>
                  <span className="count">{ticketCounts.dropped || 0}</span>
                </button>

                <button
                  className={`filter-item ${activeFilter === 'on-hold' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('on-hold')}
                >
                  <div className="status-dot status-on-hold"></div>
                  <span>On Hold</span>
                  <span className="count">{ticketCounts['on-hold'] || 0}</span>
                </button>
              </div>
            </div>

            {/* Right Side - Table */}
            <div className="ticket-table-section">
              <div className="ticket-table-container">
                <TableManager
                  data={filteredTickets}
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