import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead } from '../../types';
import { Badge, Button, EmptyState, Modal, Spinner } from '../ui';
import { LeadForm } from './LeadForm';
import { useAuthStore } from '../../store/authStore';

interface Props {
  leads: Lead[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function LeadsTable({ leads, isLoading, onDelete, onRefresh }: Props) {
  const { user } = useAuthStore();
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const navigate = useNavigate();

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!leads.length) return <EmptyState message="No leads found. Try adjusting your filters." />;

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {leads.map((lead) => (
              <tr key={lead._id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{lead.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{lead.email}</td>
                <td className="px-4 py-3"><Badge label={lead.status} /></td>
                <td className="px-4 py-3"><Badge label={lead.source} /></td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/leads/${lead._id}`)}>View</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditLead(lead)}>Edit</Button>
                    {user?.role === 'admin' && (
                      <Button size="sm" variant="danger" onClick={() => onDelete(lead._id)}>Del</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && (
          <LeadForm
            lead={editLead}
            onSuccess={() => { setEditLead(null); onRefresh(); }}
            onCancel={() => setEditLead(null)}
          />
        )}
      </Modal>
    </>
  );
}
