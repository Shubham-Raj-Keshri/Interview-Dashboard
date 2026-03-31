import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useInterviews } from '../hooks/useInterviews';
import useDebounce from '../hooks/useDebounce';
import InterviewModal from '../components/InterviewModal';
import StatusBadge from '../components/StatusBadge';
import InterviewCard from '../components/InterviewCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { interviews, loading, fetchInterviews, createInterview, updateInterview, deleteInterview } = useInterviews();

  const [filters, setFilters] = useState({ name: '', position: '', status: '', sort: 'desc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  const debouncedName = useDebounce(filters.name);
  const debouncedPosition = useDebounce(filters.position);

  useEffect(() => {
    fetchInterviews({ ...filters, name: debouncedName, position: debouncedPosition });
  }, [debouncedName, debouncedPosition, filters.status, filters.sort]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleEdit = (interview) => { setEditData(interview); setModalOpen(true); };

  const handleDelete = async (id) => {
    try { await deleteInterview(id); } catch { toast.error('Failed to delete'); }
    setDeleteConfirm(null);
  };

  const handleSubmit = async (formData) => {
    if (editData) await updateInterview(editData._id, formData);
    else await createInterview(formData);
  };

  const stats = useMemo(() => [
    { label: 'Total', value: interviews.length, color: 'from-indigo-500/20 to-indigo-600/10', accent: 'text-indigo-400', border: 'border-indigo-500/20', icon: '📋' },
    { label: 'Pending', value: interviews.filter(i => i.status === 'pending').length, color: 'from-rose-500/20 to-rose-600/10', accent: 'text-rose-400', border: 'border-rose-500/20', icon: '⏳' },
    { label: 'Scheduled', value: interviews.filter(i => i.status === 'scheduled').length, color: 'from-amber-500/20 to-amber-600/10', accent: 'text-amber-400', border: 'border-amber-500/20', icon: '📅' },
    { label: 'Completed', value: interviews.filter(i => i.status === 'completed').length, color: 'from-emerald-500/20 to-emerald-600/10', accent: 'text-emerald-400', border: 'border-emerald-500/20', icon: '✅' },
  ], [interviews]);

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Radial glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.15)]">
                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-black text-white text-xl tracking-tight">
                LearnKaro <span className="text-white/50">Hiring</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black font-black text-xs shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-white/70 hidden sm:block">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Interview Dashboard</h1>
            <p className="text-gray-400 text-base mt-2">Manage and track all candidate interviews</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setEditData(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Interview
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, color, accent, border, icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-gradient-to-br ${color} backdrop-blur-md border ${border} rounded-2xl p-5 flex items-center gap-4`}
            >
              <div className="text-2xl">{icon}</div>
              <div>
                <p className={`text-3xl font-black ${accent}`}>{value}</p>
                <p className="text-sm text-gray-400 mt-0.5 font-medium">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md border border-white/8 rounded-2xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                placeholder="Search by candidate name..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div>
            <input
              placeholder="Filter by position..."
              className="sm:w-44 px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              value={filters.position}
              onChange={(e) => handleFilterChange('position', e.target.value)}
            />
            <select
              className="sm:w-36 px-4 py-2.5 bg-zinc-950 border border-white/8 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-all"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="sm:w-36 px-4 py-2.5 bg-zinc-950 border border-white/8 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-all"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            <div className="flex border border-white/8 rounded-xl overflow-hidden bg-white/5">
              {[
                { mode: 'table', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 4v16M14 4v16" /> },
                { mode: 'card', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
              ].map(({ mode, icon }) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`px-3 py-2.5 transition-colors ${viewMode === mode ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? <LoadingState /> : interviews.length === 0 ? (
            <EmptyState onAdd={() => { setEditData(null); setModalOpen(true); }} />
          ) : viewMode === 'table' ? (
            <TableView interviews={interviews} onEdit={handleEdit} onDelete={setDeleteConfirm} />
          ) : (
            <CardView interviews={interviews} onEdit={handleEdit} onDelete={setDeleteConfirm} />
          )}
        </AnimatePresence>
      </div>

      <InterviewModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSubmit={handleSubmit}
        editData={editData}
      />

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white text-center mb-2">Delete Interview</h3>
              <p className="text-gray-500 text-sm text-center mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 border border-white/10 rounded-xl text-gray-300 font-medium hover:bg-white/5 transition-colors text-sm">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl font-medium transition-colors text-sm">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TableView = ({ interviews, onEdit, onDelete }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 backdrop-blur-md border border-white/8 rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            {['Candidate', 'Position', 'Email', 'Date', 'Status', 'Notes', 'Actions'].map(h => (
              <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview, i) => (
            <motion.tr key={interview._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="border-b border-white/5 hover:bg-white/3 transition-colors group">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-black text-xs flex-shrink-0 shadow-[0_0_12px_rgba(255,255,255,0.15)]">
                    {interview.candidate_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-white text-sm">{interview.candidate_name}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-gray-300">{interview.position}</td>
              <td className="px-5 py-4 text-sm text-gray-500">{interview.email}</td>
              <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                {new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
              <td className="px-5 py-4"><StatusBadge status={interview.status} /></td>
              <td className="px-5 py-4 text-sm text-gray-600 max-w-[140px] truncate">{interview.notes || '—'}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(interview)} className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => onDelete(interview._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="px-5 py-3 border-t border-white/5">
      <p className="text-xs text-gray-600">{interviews.length} interview{interviews.length !== 1 ? 's' : ''} found</p>
    </div>
  </motion.div>
);

const CardView = ({ interviews, onEdit, onDelete }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {interviews.map((interview, i) => (
      <motion.div key={interview._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
        <InterviewCard interview={interview} onEdit={onEdit} onDelete={onDelete} />
      </motion.div>
    ))}
  </motion.div>
);

const LoadingState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/8 rounded-2xl p-16 flex flex-col items-center gap-4">
    <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    <p className="text-gray-600 text-sm">Loading interviews...</p>
  </motion.div>
);

const EmptyState = ({ onAdd }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/8 rounded-2xl p-16 flex flex-col items-center gap-4 text-center">
    <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl">📋</div>
    <div>
      <h3 className="font-semibold text-white mb-1">No interviews yet</h3>
      <p className="text-gray-600 text-sm">Get started by adding your first interview</p>
    </div>
    <button onClick={onAdd}
      className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all text-sm">
      Add First Interview
    </button>
  </motion.div>
);

export default Dashboard;
