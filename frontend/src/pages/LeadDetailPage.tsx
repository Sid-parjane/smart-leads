import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lead } from '../types';
import { leadsApi } from '../services/api';
import { Badge, Button, Modal, Spinner } from '../components/ui';
import { LeadForm } from '../components/leads/LeadForm';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { formatDateTime } from '../utils/format';
import toast from 'react-hot-toast';

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const fetchLead = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data } = await leadsApi.getOne(id);
      setLead(data.data ?? null);
    } catch {
      toast.error('Lead not found');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (!lead) return;
    if (!confirm('Delete this lead?')) return;
    await leadsApi.delete(lead._id);
    toast.success('Lead deleted');
    navigate('/dashboard');
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex justify-center py-24"><Spinner size="lg" /></div>
    </div>
  );

  if (!lead) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-center gap-2">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            ← Back
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">{lead.email}</p>
            </div>
            <div className="flex gap-2">
              <Badge label={lead.status} />
              <Badge label={lead.source} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Created</p>
              <p className="text-gray-700 dark:text-gray-300">{formatDateTime(lead.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Last Updated</p>
              <p className="text-gray-700 dark:text-gray-300">{formatDateTime(lead.updatedAt)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Created By</p>
              <p className="text-gray-700 dark:text-gray-300">{lead.createdBy?.name ?? '—'}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button onClick={() => setShowEdit(true)}>Edit Lead</Button>
            {user?.role === 'admin' && (
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            )}
          </div>
        </div>
      </main>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Lead">
        <LeadForm
          lead={lead}
          onSuccess={() => { setShowEdit(false); fetchLead(); }}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>
    </div>
  );
}
