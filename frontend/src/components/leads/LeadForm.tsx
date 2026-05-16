import { useState } from 'react';
import { Lead, LeadStatus, LeadSource } from '../../types';
import { leadsApi } from '../../services/api';
import { Button, Input, Select } from '../ui';
import toast from 'react-hot-toast';

interface Props {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

interface FormData { name: string; email: string; status: LeadStatus; source: LeadSource; }
interface FormErrors { name?: string; email?: string; source?: string; }

export function LeadForm({ lead, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormData>({
    name: lead?.name || '',
    email: lead?.email || '',
    status: lead?.status || 'New',
    source: lead?.source || 'Website',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (!form.email.trim()) errs.email = 'Email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.source) errs.source = 'Source required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (lead) {
        await leadsApi.update(lead._id, form);
        toast.success('Lead updated');
      } else {
        await leadsApi.create(form);
        toast.success('Lead created');
      }
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="Jane Doe" />
      <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} placeholder="jane@example.com" />
      <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })} options={STATUS_OPTIONS} />
      <Select label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })} options={SOURCE_OPTIONS} />
      {errors.source && <p className="text-xs text-red-500">{errors.source}</p>}
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>{lead ? 'Update Lead' : 'Create Lead'}</Button>
      </div>
    </form>
  );
}
