import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import TableManager, { type TableColumn, type TableState, type FilterRule, type SortRule } from '../../../components/TableManager/TableManager';
import TableControls from '../../../components/TableControls/TableControls';
import './styles.css';
import { z } from 'zod';

interface Person {
  UserName: string;
  FirstName: string;
  LastName: string;
  MiddleName: string | null;
  Gender: string;
  Age: number | null;
}

const filterRuleSchema = z.object({
  column: z.string(),
  relation: z.enum(['equals', 'contains', 'startsWith']),
  value: z.string(),
});

const sortRuleSchema = z.object({
  column: z.string(),
  order: z.enum(['asc', 'desc']),
});

const odataSearchSchema = z.object({
  page: z.number().catch(1),
  filters: z.array(filterRuleSchema).catch([]),
  sorters: z.array(sortRuleSchema).catch([]),
});

const columns: TableColumn[] = [
  { id: 'UserName', caption: 'User Name', filterable: true, sortable: true },
  { id: 'FirstName', caption: 'First Name', filterable: true, sortable: true },
  { id: 'LastName', caption: 'Last Name', filterable: true, sortable: true },
  { id: 'Gender', caption: 'Gender', filterable: true, sortable: true, size: 100, align: 'center' },
  { id: 'Age', caption: 'Age', sortable: true, size: 80, align: 'center', type: 'number' }
];

export const Route = createFileRoute('/_authenticated/odata/')({
  validateSearch: (search) => odataSearchSchema.parse(search),
  component: ODataPage,
});

function ODataPage() {
  const [data, setData] = useState<Person[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tableManagerRef = useRef<any>(null);

  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = useSearch({ from: Route.id });
  const rowsPerPage = 8;

  const onStateChange = (newState: Partial<TableState>) => {
    navigate({ search: (prev) => ({ ...prev, ...newState }), replace: true });
  };

  const fetchData = useCallback(async (state: TableState) => {
    const buildODataUrl = (currentState: TableState): string => {
      const { page = 1, filters = [], sorters = [] } = currentState;
      const url = new URL('https://services.odata.org/v4/TripPinServiceRW/People');

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
    };

    setIsLoading(true);
    setError(null);
    const url = buildODataUrl(state);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      setData(result.value);
      setTotalRecords(result['@odata.count']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(searchParams as TableState);
  }, [searchParams, fetchData]);

  return (
    <div className="odata-page">
      <div className="page-header-section">
        <div className="page-header-content">
          <h1>OData - TripPin Service</h1>
        </div>
      </div>
      <div className="odata-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        )}
        {error && <div className="error-message">Error: {error}</div>}
        
        <TableControls 
          tableManagerRef={tableManagerRef} 
          status={{ 
            filterCount: searchParams.filters.length, 
            sorterCount: searchParams.sorters.length,
          }} 
        />
        <div className="ticket-table-container">
          <TableManager
            ref={tableManagerRef}
            data={data}
            columns={columns}
            rowsPerPage={rowsPerPage}
            emptyMessage="No data found."
            filters={searchParams.filters}
            sorters={searchParams.sorters}
            currentPage={searchParams.page}
            totalRecords={totalRecords}
            onStateChange={onStateChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ODataPage;