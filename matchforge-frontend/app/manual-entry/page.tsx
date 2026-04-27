'use client';
import { Layout } from '@/components/Layout';
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function ManualEntryPage() {
  const { saveApplication } = useAppContext();
  const router = useRouter();
  const [form, setForm] = useState({
    company: '',
    role: '',
    appliedDate: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveApplication(
      form.company,
      form.role,
      0,                              // default score (can be updated later)
      'Applied',                     // initial status
      form.appliedDate || new Date().toISOString(),
      form.notes
    );
    router.push('/applications');
  };

  return (
    <Layout title="Manual Entry" subtitle="Add a job application manually">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5 bg-[var(--card)] p-6 rounded-xl border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium mb-1">Company *</label>
          <input
            type="text"
            required
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full p-2 border rounded-lg bg-[var(--paper)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role / Title *</label>
          <input
            type="text"
            required
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-2 border rounded-lg bg-[var(--paper)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Applied Date</label>
          <input
            type="date"
            value={form.appliedDate}
            onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
            className="w-full p-2 border rounded-lg bg-[var(--paper)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full p-2 border rounded-lg bg-[var(--paper)]"
            placeholder="Add any details about the application, interview, etc."
          />
        </div>
        <button type="submit" className="btn-primary btn w-full">Save Application</button>
      </form>
    </Layout>
  );
}