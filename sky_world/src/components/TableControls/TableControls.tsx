import React from 'react';
import { CancelIcon, FilterIcon, SortIcon } from '../Icons';
import './TableControls.css';

interface TableControlsProps {
  tableManagerRef: React.RefObject<any>;
  status: {
    filterCount: number;
    sorterCount: number;
  };
}

const TableControls: React.FC<TableControlsProps> = ({ tableManagerRef, status }) => {
  return (
    <div className="table-controls">
      <button className="table-control-btn" onClick={() => tableManagerRef.current?.openSortModal()}>
        <SortIcon />
        Sort
      </button>
      {status.sorterCount > 0 && (
        <div className="control-badge">
          <span>{status.sorterCount} Sort</span>
          <button className="clear-badge" onClick={() => tableManagerRef.current?.resetSorters()} title="Clear Sort">
            <CancelIcon width={12} height={12} color="white" />
          </button>
        </div>
      )}
      <button className="table-control-btn" onClick={() => tableManagerRef.current?.openFilterModal()}>
        <FilterIcon />
        Filter
      </button>
      {status.filterCount > 0 && (
        <div className="control-badge">
          <span>{status.filterCount} Filter</span>
          <button className="clear-badge" onClick={() => tableManagerRef.current?.resetFilters()} title="Clear Filter">
            <CancelIcon width={12} height={12} color="white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TableControls;