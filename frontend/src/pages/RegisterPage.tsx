import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button, Input, Select } from '../components/ui';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (!form.email) errs.email = 'Email required';
    if (form.password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch {
      toast.error('Registration failed');
    }
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono mb-1">Create Account</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Join SmartLeads today</p>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4">
          <Input label="Full Name" value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} placeholder="Jane Doe" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} error={errors.password} placeholder="••••••••" />
          <Select label="Role" value={form.role} onChange={(e) => update('role', e.target.value)} options={[{ value: 'sales', label: 'Sales' }, { value: 'admin', label: 'Admin' }]} />
          <Button type="submit" isLoading={isLoading} className="w-full mt-2">Register</Button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Have account? <Link to="/login" className="text-brand-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
