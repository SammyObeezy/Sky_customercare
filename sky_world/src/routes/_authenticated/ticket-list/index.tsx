import React, { useState, useMemo, useRef } from 'react';
import { Link, createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter'; // 1. ADD THIS IMPORT
import TableManager, { type TableColumn, type TableState, type FilterRule, type SortRule } from '../../../components/TableManager/TableManager';
import TableControls from '../../../components/TableControls/TableControls';
import { useTickets, type Ticket } from '../../../contexts/TicketsContext';
import './styles.css';
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
  // 2. WRAP THE SCHEMA WITH THE VALIDATOR
  validateSearch: zodValidator(ticketsSearchSchema),
  component: TicketList,
});

function TicketList() {
  const { tickets, getTicketCounts } = useTickets();
  const [activeTab, setActiveTab] = useState('all-tickets');
  const [activeFilter, setActiveFilter] = useState('all');
  const tableManagerRef = useRef<any>(null);
  const ticketCounts = getTicketCounts();
  
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, filters, sorters } = useSearch({ from: Route.id });
  const rowsPerPage = 8;

  const onStateChange = (newState: Partial<TableState>) => {
    navigate({ search: (prev) => ({ ...prev, ...newState }), replace: true });
  };

  const processedData = useMemo(() => {
    let processed = tickets.filter(ticket => {
      if (activeFilter === 'all') return true;
      const filterMap: Record<string, string> = { 'open': 'Open', 'in-progress': 'In Progress', 'resolved': 'Resolved', 'closed': 'Closed', 'dropped': 'Dropped', 'on-hold': 'On Hold' };
      return ticket.ticketStatus === filterMap[activeFilter];
    });

    if (filters.length > 0) {
      processed = processed.filter((item: Ticket) =>
        filters.every(filter => {
          if (!filter.column || !filter.value) return true;
          const itemValue = (item[filter.column as keyof Ticket] || '').toString().toLowerCase();
          const filterValue = filter.value.toLowerCase();
          switch (filter.relation) {
            case 'equals': return itemValue === filterValue;
            case 'contains': return itemValue.includes(filterValue);
            case 'startsWith': return itemValue.startsWith(filterValue);
            default: return true;
          }
        })
      );
    }

    if (sorters.length > 0) {
      processed.sort((a: Ticket, b: Ticket) => {
        for (const sorter of sorters) {
          const valA = a[sorter.column as keyof Ticket];
          const valB = b[sorter.column as keyof Ticket];
          let comparison = 0;
          if (valA > valB) comparison = 1;
          else if (valA < valB) comparison = -1;
          if (comparison !== 0) {
            return sorter.order === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    return processed;
  }, [tickets, activeFilter, filters, sorters]);
  
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, page]);

  const columns: TableColumn[] = [
    { id: 'id', caption: 'Ticket ID', filterable: true, sortable: true, size: 100, align: 'center' },
    { id: 'ticketSubject', caption: 'Ticket Subject', filterable: true, sortable: true, size: 300, render: (row) => (<Link to="/ticket/$ticketId" params={{ ticketId: btoa(row.id.toString()) }} className="ticket-link">{row.ticketSubject}</Link>) },
    { id: 'ticketStatus', caption: 'Ticket Status', filterable: true, sortable: true, size: 120, align: 'center', render: (row) => (<span>{row.ticketStatus}</span>)},
    { id: 'source', caption: 'Source', filterable: true, sortable: true, size: 120, align: 'center' },
    { id: 'dateRequested', caption: 'Date Requested', filterable: true, sortable: true, size: 160, align: 'center', render: (row) => { const date = new Date(row.dateRequested); return (<span>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>); } }
  ];

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
              <TableControls 
                tableManagerRef={tableManagerRef} 
                status={{ 
                  filterCount: filters.length, 
                  sorterCount: sorters.length,
                }} 
              />
              <div className="ticket-table-container">
                <TableManager
                  ref={tableManagerRef}
                  data={paginatedData}
                  columns={columns}
                  rowsPerPage={rowsPerPage}
                  emptyMessage="No tickets found."
                  filters={filters}
                  sorters={sorters}
                  currentPage={page}
                  totalRecords={processedData.length}
                  onStateChange={onStateChange}
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