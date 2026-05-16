import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '../../types';
import { Input, Select } from '../ui';

interface Props {
  filters: LeadFilters;
  onFilterChange: (key: keyof LeadFilters, value: string) => void;
}

const STATUS_OPTS = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTS = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const SORT_OPTS = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export function LeadFiltersBar({ filters, onFilterChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search by name or email..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>
      <div className="w-full sm:w-40">
        <Select
          value={filters.status || ''}
          options={STATUS_OPTS}
          onChange={(e) => onFilterChange('status', e.target.value as LeadStatus | '')}
        />
      </div>
      <div className="w-full sm:w-40">
        <Select
          value={filters.source || ''}
          options={SOURCE_OPTS}
          onChange={(e) => onFilterChange('source', e.target.value as LeadSource | '')}
        />
      </div>
      <div className="w-full sm:w-36">
        <Select
          value={filters.sort || 'latest'}
          options={SORT_OPTS}
          onChange={(e) => onFilterChange('sort', e.target.value as SortOrder)}
        />
      </div>
    </div>
  );
}
