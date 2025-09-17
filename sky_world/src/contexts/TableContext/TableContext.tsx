import React, { createContext, useContext, useMemo, useRef, type ReactNode, useState, useEffect, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { type TableColumn, type TableAction, type FilterRule, type SortRule } from '../../components/TableManager/TableManager';
import TableManager from '../../components/TableManager/TableManager';
import TableControls from '../../components/TableControls/TableControls';

export interface TableState {
  page: number;
  filters: FilterRule[];
  sorters: SortRule[];
}

export interface TableContextValue {
  state: TableState;
  data: any[];
  totalRecords: number;
  isLoading: boolean;
  error: string | null;
  updateState: (newState: Partial<TableState>) => void;
  columns: TableColumn[];
  actions?: TableAction[];
  rowsPerPage: number;
  emptyMessage: string;
  tableManagerRef: React.RefObject<any>;
  getControlStatus: () => {
    filterCount: number;
    sorterCount: number;
  };
}

interface TableProviderProps {
  children: ReactNode;
  state: TableState;
  onStateChange: (newState: Partial<TableState>) => void;
  rowsPerPage?: number;
  config: TableProviderConfig;
}

type TableProviderConfig = TicketConfig | ODataConfig;

interface TicketConfig {
  type: 'tickets';
  tickets: any[];
  activeFilter: string;
}

interface ODataConfig {
  type: 'odata';
}

interface Person {
  UserName: string;
  FirstName: string;
  LastName: string;
  MiddleName: string | null;
  Gender: string;
  Age: number | null;
}

const TableContext = createContext<TableContextValue | null>(null);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};

export const TableWithContext: React.FC = () => {
  const {
    data,
    columns,
    actions,
    rowsPerPage,
    emptyMessage,
    state,
    totalRecords,
    updateState,
    tableManagerRef,
  } = useTableContext();

  return (
    <TableManager
      ref={tableManagerRef}
      data={data}
      columns={columns}
      actions={actions}
      rowsPerPage={rowsPerPage}
      emptyMessage={emptyMessage}
      filters={state.filters}
      sorters={state.sorters}
      currentPage={state.page}
      totalRecords={totalRecords}
      onStateChange={updateState}
    />
  );
};

export const TableControlsWithContext: React.FC = () => {
  const { tableManagerRef, getControlStatus } = useTableContext();
  
  return (
    <TableControls 
      tableManagerRef={tableManagerRef}
      status={getControlStatus()}
    />
  );
};

export const LoadingOverlay: React.FC = () => {
  const { isLoading } = useTableContext();
  
  if (!isLoading) return null;
  
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export const ErrorMessage: React.FC = () => {
  const { error } = useTableContext();
  
  if (!error) return null;
  
  return <div className="error-message">Error: {error}</div>;
};

export const TableProvider: React.FC<TableProviderProps> = ({
  children,
  state,
  onStateChange,
  rowsPerPage = 8,
  config,
}) => {
  const tableManagerRef = useRef<any>(null);
  const [odataData, setOdataData] = useState<Person[]>([]);
  const [odataTotalRecords, setOdataTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(config.type === 'odata');
  const [error, setError] = useState<string | null>(null);

  const getColumns = (): TableColumn[] => {
    if (config.type === 'tickets') {
      return [
        { id: 'id', caption: 'Ticket ID', filterable: true, sortable: true, size: 100, align: 'center' },
        { 
          id: 'ticketSubject', 
          caption: 'Ticket Subject', 
          filterable: true, 
          sortable: true, 
          size: 300, 
          render: (row) => (
            <Link 
              to="/ticket/$ticketId" 
              params={{ ticketId: btoa(row.id.toString()) }} 
              className="ticket-link"
            >
              {row.ticketSubject}
            </Link>
          ) 
        },
        { 
          id: 'ticketStatus', 
          caption: 'Ticket Status', 
          filterable: true, 
          sortable: true, 
          size: 120, 
          align: 'center', 
          render: (row) => (<span>{row.ticketStatus}</span>)
        },
        { id: 'source', caption: 'Source', filterable: true, sortable: true, size: 120, align: 'center' },
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
              <span>
                {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            );
          }
        }
      ];
    } else {
      return [
        { id: 'UserName', caption: 'User Name', filterable: true, sortable: true },
        { id: 'FirstName', caption: 'First Name', filterable: true, sortable: true },
        { id: 'LastName', caption: 'Last Name', filterable: true, sortable: true },
        { id: 'Gender', caption: 'Gender', filterable: true, sortable: true, size: 100, align: 'center' },
        { id: 'Age', caption: 'Age', sortable: true, size: 80, align: 'center', type: 'number' }
      ];
    }
  };

  const buildODataUrl = useCallback((currentState: TableState): string => {
    const { page = 1, filters = [], sorters = [] } = currentState;
    const url = new URL('https://services.odata.org/v4/TripPinServiceRW/People');
    const columns = getColumns();

    url.searchParams.append('$count', 'true');
    url.searchParams.append('$top', rowsPerPage.toString());
    url.searchParams.append('$skip', ((page - 1) * rowsPerPage).toString());

    if (sorters.length > 0) {
      const orderby = sorters.map(s => `${s.column} ${s.order}`).join(',');
      url.searchParams.append('$orderby', orderby);
    }

    if (filters.length > 0) {
      const columnTypes = columns.reduce((acc, col) => {
        acc[col.id] = col.type || 'string';
        return acc;
      }, {} as Record<string, string>);

      const filterClauses = filters.map(f => {
        if (!f.column || !f.value) return '';
        if (columnTypes[f.column] === 'number') {
          if (isNaN(Number(f.value)) || f.relation !== 'equals') return '';
          return `${f.column} eq ${f.value}`;
        } else {
          const val = `'${f.value.replace(/'/g, "''")}'`;
          switch (f.relation) {
            case 'equals': return `${f.column} eq ${val}`;
            case 'contains': return `contains(${f.column}, ${val})`;
            case 'startsWith': return `startswith(${f.column}, ${val})`;
            default: return '';
          }
        }
      }).filter(Boolean);

      if (filterClauses.length > 0) {
        url.searchParams.append('$filter', filterClauses.join(' and '));
      }
    }
    return url.toString();
  }, [rowsPerPage]);

  const fetchODataData = useCallback(async (currentState: TableState) => {
    setIsLoading(true);
    setError(null);
    const url = buildODataUrl(currentState);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      setOdataData(result.value);
      setOdataTotalRecords(result['@odata.count']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setOdataData([]);
      setOdataTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  }, [buildODataUrl]);

  useEffect(() => {
    if (config.type === 'odata') {
      fetchODataData(state);
    }
  }, [state, fetchODataData, config.type]);

  const processedTicketData = useMemo(() => {
    if (config.type !== 'tickets') return [];

    let processed = config.tickets.filter(ticket => {
      if (config.activeFilter === 'all') return true;
      const filterMap: Record<string, string> = {
        'open': 'Open',
        'in-progress': 'In Progress',
        'resolved': 'Resolved',
        'closed': 'Closed',
        'dropped': 'Dropped',
        'on-hold': 'On Hold'
      };
      return ticket.ticketStatus === filterMap[config.activeFilter];
    });

    if (state.filters.length > 0) {
      processed = processed.filter((item: any) =>
        state.filters.every(filter => {
          if (!filter.column || !filter.value) return true;
          const itemValue = (item[filter.column] || '').toString().toLowerCase();
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

    if (state.sorters.length > 0) {
      processed.sort((a: any, b: any) => {
        for (const sorter of state.sorters) {
          const valA = a[sorter.column];
          const valB = b[sorter.column];
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
  }, [config, state.filters, state.sorters]);

  const paginatedTicketData = useMemo(() => {
    if (config.type !== 'tickets') return [];
    const startIndex = (state.page - 1) * rowsPerPage;
    return processedTicketData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedTicketData, state.page, rowsPerPage, config.type]);

  const contextValue: TableContextValue = {
    state,
    data: config.type === 'tickets' ? paginatedTicketData : odataData,
    totalRecords: config.type === 'tickets' ? processedTicketData.length : odataTotalRecords,
    isLoading: config.type === 'odata' ? isLoading : false,
    error,
    updateState: onStateChange,
    columns: getColumns(),
    actions: [],
    rowsPerPage,
    emptyMessage: config.type === 'tickets' ? "No tickets found." : "No data found.",
    tableManagerRef,
    getControlStatus: () => ({
      filterCount: state.filters.length,
      sorterCount: state.sorters.length,
    }),
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};