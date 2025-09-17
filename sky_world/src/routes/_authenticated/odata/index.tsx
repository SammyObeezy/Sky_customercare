// Updated ODataPage.tsx with Direct Imports
import React from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { 
  TableProvider, 
  TableWithContext, 
  TableControlsWithContext,
  LoadingOverlay,
  ErrorMessage,
  type TableState 
} from '../../../contexts/TableContext/TableContext';
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

const odataSearchSchema = z.object({
  page: z.number().catch(1),
  filters: z.array(filterRuleSchema).catch([]),
  sorters: z.array(sortRuleSchema).catch([]),
});

export const Route = createFileRoute('/_authenticated/odata/')({
  validateSearch: zodValidator(odataSearchSchema),
  component: ODataPage,
});

function ODataPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = useSearch({ from: Route.id });

  const onStateChange = (newState: Partial<TableState>) => {
    navigate({ search: (prev) => ({ ...prev, ...newState }), replace: true });
  };

  const tableState: TableState = {
    page: searchParams.page,
    filters: searchParams.filters,
    sorters: searchParams.sorters,
  };

  return (
    <div className="odata-page">
      <div className="page-header-section">
        <div className="page-header-content">
          <h1>OData - TripPin Service</h1>
        </div>
      </div>
      <div className="odata-container">
        <TableProvider
          state={tableState}
          onStateChange={onStateChange}
          config={{ type: 'odata' }}
        >
          <LoadingOverlay />
          <ErrorMessage />
          <TableControlsWithContext />
          <div className="ticket-table-container">
            <TableWithContext />
          </div>
        </TableProvider>
      </div>
    </div>
  );
}

export default ODataPage;