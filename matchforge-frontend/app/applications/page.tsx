'use client';
import { Layout } from '@/components/Layout';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';

export default function ApplicationsPage() {
  const { applications, updateApplicationStatus, updateApplicationNotes } = useAppContext();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [notes, setNotes] = useState('');

  const openNotesModal = (app: any) => {
    setSelectedApp(app);
    setNotes(app.notes || '');
  };

  const saveNotes = async () => {
    await updateApplicationNotes(selectedApp.id, notes);
    setSelectedApp(null);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    await updateApplicationStatus(id, newStatus);
  };

  const statusOptions = ['Applied', 'Assessment', 'Interview', 'Ghosted', 'Rejected', 'Accepted'];
  const statusColors: Record<string, string> = {
    Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Assessment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    Interview: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Ghosted: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    Accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };

  return (
    <Layout title="Application Tracker" subtitle="Manage all your job applications">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)]">
            <tr>
              <th className="text-left py-3 px-2">Company</th>
              <th className="text-left py-3 px-2">Role</th>
              <th className="text-left py-3 px-2">Applied Date</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-[var(--border)] hover:bg-[var(--paper)]">
                <td className="py-2 px-2 font-medium">{app.company}</td>
                <td className="py-2 px-2 text-[var(--ink3)]">{app.role}</td>
                <td className="py-2 px-2 text-[var(--ink3)]">{new Date(app.appliedDate).toLocaleDateString()}</td>
                <td className="py-2 px-2">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[app.status] || 'bg-gray-100'}`}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-2">
                  <button onClick={() => openNotesModal(app)} className="text-blue-600 hover:underline text-xs">
                    Notes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && (
          <div className="text-center py-8 text-[var(--ink3)]">No applications yet. Use the Manual Entry form to add one.</div>
        )}
      </div>

      {/* Notes Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] rounded-xl p-6 w-full max-w-md border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-2">{selectedApp.company} – {selectedApp.role}</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full p-3 border rounded-lg bg-[var(--paper)] text-[var(--ink)]"
              placeholder="Write notes about interview questions, assessment details, follow‑up dates..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setSelectedApp(null)} className="btn">Cancel</button>
              <button onClick={saveNotes} className="btn-primary btn">Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}