'use client';
import { Layout } from '@/components/Layout';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';

export default function ApplicationsPage() {
  const { applications, updateApplicationStatus, updateApplicationNotes, saveApplication, deleteApplication } = useAppContext();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [newApp, setNewApp] = useState({
    company: '',
    role: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    score: 50,
    notes: '',
  });

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

  const handleDelete = async (id: number, company: string, role: string) => {
    if (confirm(`Delete application for ${company} (${role})?`)) {
      await deleteApplication(id);
    }
  };

  const handleNewApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveApplication(
      newApp.company,
      newApp.role,
      newApp.score,
      newApp.status,
      newApp.appliedDate,
      newApp.notes
    );
    setShowModal(false);
    setNewApp({
      company: '',
      role: '',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      score: 50,
      notes: '',
    });
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['All', 'Applied', 'Assessment', 'Interview', 'Ghosted', 'Rejected', 'Accepted', 'Offer'];
  const statusColors: Record<string, string> = {
    Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Assessment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    Interview: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Ghosted: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    Accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Offer: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  };

  return (
    <Layout title="Application Tracker" subtitle="Track all your job applications">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded-lg bg-[var(--paper)] text-[var(--ink)]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg bg-[var(--paper)] text-[var(--ink)]"
        >
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-primary btn whitespace-nowrap">
          + New Application
        </button>
        {(searchTerm || statusFilter !== 'All') && (
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
            className="btn"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)]">
            <tr>
              <th className="text-left py-3 px-2">Company</th>
              <th className="text-left py-3 px-2">Role</th>
              <th className="text-left py-3 px-2">Applied Date</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Score</th>
              <th className="text-left py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
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
                    {statusOptions.slice(1).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-2">{app.score}</td>
                <td className="py-2 px-2">
                  <div className="flex gap-3">
                    <button onClick={() => openNotesModal(app)} className="text-blue-600 hover:underline text-xs">
                      Notes
                    </button>
                    <button
                      onClick={() => handleDelete(app.id, app.company, app.role)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredApplications.length === 0 && (
          <div className="text-center py-8 text-[var(--ink3)]">
            No applications match the filters. Try changing search or status.
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-xl p-6 w-full max-w-md border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-2">{selectedApp.company} – {selectedApp.role}</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full p-3 border rounded-lg bg-[var(--paper)] text-[var(--ink)]"
              placeholder="Add notes about the interview, assessment, next steps..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setSelectedApp(null)} className="btn">Cancel</button>
              <button onClick={saveNotes} className="btn-primary btn">Save Notes</button>
            </div>
          </div>
        </div>
      )}

      {/* New Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-xl w-full max-w-md max-h-[90vh] flex flex-col border border-[var(--border)]">
            <div className="sticky top-0 bg-[var(--card)] rounded-t-xl px-6 pt-6 pb-2 z-10 border-b border-[var(--border)]">
              <h3 className="text-lg font-semibold">Add New Application</h3>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form id="new-app-form" onSubmit={handleNewApplication} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={newApp.company}
                    onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-[var(--paper)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role *</label>
                  <input
                    type="text"
                    required
                    value={newApp.role}
                    onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-[var(--paper)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Applied Date</label>
                  <input
                    type="date"
                    value={newApp.appliedDate}
                    onChange={(e) => setNewApp({ ...newApp, appliedDate: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-[var(--paper)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={newApp.status}
                    onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-[var(--paper)]"
                  >
                    {statusOptions.slice(1).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Match Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newApp.score}
                    onChange={(e) => setNewApp({ ...newApp, score: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border rounded-lg bg-[var(--paper)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={newApp.notes}
                    onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-[var(--paper)]"
                    placeholder="Optional notes"
                  />
                </div>
              </form>
            </div>
            <div className="sticky bottom-0 bg-[var(--card)] rounded-b-xl px-6 py-4 pt-2 flex justify-end gap-2 border-t border-[var(--border)]">
              <button type="button" onClick={() => setShowModal(false)} className="btn">Cancel</button>
              <button type="submit" form="new-app-form" className="btn-primary btn">Save Application</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}