import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import TableManager, { TableColumn } from '../../components/TableManager/TableManager';
import { useTickets } from '../../contexts/TicketsContext';
import './TicketList.css';

const TicketList: React.FC = () => {
  const { tickets, getTicketCounts } = useTickets();
  const [activeTab, setActiveTab] = useState('all-tickets');
  const [activeFilter, setActiveFilter] = useState('all');
  

// Add this line here
const tableManagerRef = useRef<any>(null);

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
          <span>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
            {/* Right Side - Table */}
            <div className="ticket-table-section">
              {/* Add table controls before the table container */}
              <div className="table-controls">
                <button
                  className="table-control-btn"
                  onClick={() => tableManagerRef.current?.openFilterModal()}
                  title="Filter Table"
                >
                  <svg width="20" height="20" viewBox="0 0 19 13" fill="none">
                    <path d="M3.61743 7.0542H15.6174V5.0542H3.61743M0.617432 0.0541992V2.0542H18.6174V0.0541992M7.61743 12.0542H11.6174V10.0542H7.61743V12.0542Z" fill="currentColor" />
                  </svg>
                  Filter
                </button>

                <button
                  className="table-control-btn"
                  onClick={() => tableManagerRef.current?.openSortModal()}
                  title="Sort Table"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640" fill="currentColor">
                    <path d="M278.6 438.6L182.6 534.6C170.1 547.1 149.8 547.1 137.3 534.6L41.3 438.6C28.8 426.1 28.8 405.8 41.3 393.3C53.8 380.8 74.1 380.8 86.6 393.3L128 434.7V128c0-17.7 14.3-32 32-32s32 14.3 32 32v306.7L233.4 393.3c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3zM352 96h32c17.7 0 32 14.3 32 32s-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h96c17.7 0 32 14.3 32 32s-14.3 32-32 32h-96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h160c17.7 0 32 14.3 32 32s-14.3 32-32 32H352c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H352c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
                  </svg>
                  Sort
                </button>
              </div>

              <div className="ticket-table-container">
                <TableManager
  ref={tableManagerRef}
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