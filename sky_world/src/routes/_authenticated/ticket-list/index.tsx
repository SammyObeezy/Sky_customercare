import React, { useState } from 'react';
import { Link, createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { useTickets } from '../../../contexts/TicketsContext';
import { 
  TableProvider, 
  TableWithContext, 
  TableControlsWithContext,
  type TableState 
} from '../../../contexts/TableContext/TableContext';
import './TicketList.css';
import { z } from 'zod';

const filterRuleSchema = z.object({
  column: z.string(),
  relation: z.enum(['equals', 'contains', 'startsWith']),
  value: z.string(),
});

const sortRuleSchema = z.object({
  column: z.string(),
  order: z.enum(['asc', 'desc']),
});

const ticketsSearchSchema = z.object({
  page: z.number().catch(1),
  filters: z.array(filterRuleSchema).catch([]),
  sorters: z.array(sortRuleSchema).catch([]),
});

export const Route = createFileRoute('/_authenticated/ticket-list/')({
  validateSearch: zodValidator(ticketsSearchSchema),
  component: TicketList,
});

function TicketList() {
  const { tickets, getTicketCounts } = useTickets();
  const [activeTab, setActiveTab] = useState('all-tickets');
  const [activeFilter, setActiveFilter] = useState('all');
  const ticketCounts = getTicketCounts();
  
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, filters, sorters } = useSearch({ from: Route.id });

  const onStateChange = (newState: Partial<TableState>) => {
    navigate({ search: (prev) => ({ ...prev, ...newState }), replace: true });
  };

  const tableState: TableState = { page, filters, sorters };

  return (
    <div className="ticket-list-page">
      <div className="ticket-tabs">
        <button className={`tab-button ${activeTab === 'all-tickets' ? 'active' : ''}`} onClick={() => setActiveTab('all-tickets')}>All Tickets</button>
        <div className="tab-header-section">
          <h2>All Tickets</h2>
          <Link to="/add-ticket" className="add-ticket-btn">Add Ticket</Link>
        </div>
      </div>
      <div className="tab-content">
        {activeTab === 'all-tickets' && (
          <div className="ticket-content-layout">
            <div className="ticket-filter-sidebar">
              <div className="filter-list">
                 <button className={`filter-item ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
                   <div className="status-dot status-all"></div>
                   <span>All</span>
                   <span className="count">{ticketCounts.all || 0}</span>
                 </button>
                 <button className={`filter-item ${activeFilter === 'open' ? 'active' : ''}`} onClick={() => setActiveFilter('open')}>
                   <div className="status-dot status-open"></div>
                   <span>Open</span>
                   <span className="count">{ticketCounts.open || 0}</span>
                 </button>
                 <button className={`filter-item ${activeFilter === 'in-progress' ? 'active' : ''}`} onClick={() => setActiveFilter('in-progress')}>
                   <div className="status-dot status-in-progress"></div>
                   <span>In Progress</span>
                   <span className="count">{ticketCounts['in-progress'] || 0}</span>
                 </button>
                 <button className={`filter-item ${activeFilter === 'resolved' ? 'active' : ''}`} onClick={() => setActiveFilter('resolved')}>
                   <div className="status-dot status-resolved"></div>
                   <span>Resolved</span>
                   <span className="count">{ticketCounts.resolved || 0}</span>
                 </button>
                 <button className={`filter-item ${activeFilter === 'closed' ? 'active' : ''}`} onClick={() => setActiveFilter('closed')}>
                   <div className="status-dot status-closed"></div>
                   <span>Closed</span>
                   <span className="count">{ticketCounts.closed || 0}</span>
                 </button>
                 <button className={`filter-item ${activeFilter === 'dropped' ? 'active' : ''}`} onClick={() => setActiveFilter('dropped')}>
                   <div className="status-dot status-dropped"></div>
                   <span>Dropped</span>
                   <span className="count">{ticketCounts.dropped || 0}</span>
                 </button>
                 <button className={`filter-item ${activeFilter === 'on-hold' ? 'active' : ''}`} onClick={() => setActiveFilter('on-hold')}>
                   <div className="status-dot status-on-hold"></div>
                   <span>On Hold</span>
                   <span className="count">{ticketCounts['on-hold'] || 0}</span>
                 </button>
              </div>
            </div>
            <div className="ticket-table-section">
              <TableProvider
                state={tableState}
                onStateChange={onStateChange}
                config={{
                  type: 'tickets',
                  tickets,
                  activeFilter,
                }}
              >
                <TableControlsWithContext />
                <div className="ticket-table-container">
                  <TableWithContext />
                </div>
              </TableProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketList;