import { useState, useEffect } from 'react';
import { LeadFilters } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { useLeads } from '../hooks/useLeads';
import { LeadFiltersBar } from '../components/leads/LeadFilters';
import { LeadsTable } from '../components/leads/LeadsTable';
import { Pagination } from '../components/leads/Pagination';
import { LeadForm } from '../components/leads/LeadForm';
import { StatsCards } from '../components/leads/StatsCards';
import { Button, Modal } from '../components/ui';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { leadsApi } from '../services/api';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const { user } = useAuthStore();
  const [rawSearch, setRawSearch] = useState('');
  const debouncedSearch = useDebounce(rawSearch, 400);
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1 });
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const { leads, meta, isLoading, refetch, deleteLead } = useLeads(filters);

  const handleFilterChange = (key: keyof LeadFilters, value: string) => {
    if (key === 'search') { setRawSearch(value); return; }
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }));
  };

  const handleExport = async () => {
    try {
      const { data } = await leadsApi.exportCSV({ status: filters.status, source: filters.source, search: filters.search });
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url; a.download = 'leads.csv'; a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported');
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage and track your leads</p>
          </div>
          <div className="flex gap-3">
            {user?.role === 'admin' && (
              <Button variant="outline" onClick={handleExport}>Export CSV</Button>
            )}
            <Button onClick={() => setShowCreate(true)}>+ Add Lead</Button>
          </div>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Filters */}
        <LeadFiltersBar filters={{ ...filters, search: rawSearch }} onFilterChange={handleFilterChange} />

        {/* Table */}
        <LeadsTable leads={leads} isLoading={isLoading} onDelete={deleteLead} onRefresh={refetch} />

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
        )}
      </main>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Lead">
        <LeadForm onSuccess={() => { setShowCreate(false); refetch(); }} onCancel={() => setShowCreate(false)} />
      </Modal>
    </div>
  );
}
