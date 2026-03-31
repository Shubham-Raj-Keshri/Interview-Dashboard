import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL = { candidate_name: '', position: '', email: '', status: 'pending', date: '', notes: '' };

const InterviewModal = ({ isOpen, onClose, onSubmit, editData }) => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editData) setForm({ ...editData, date: editData.date ? editData.date.split('T')[0] : '' });
    else setForm(INITIAL);
    setErrors({});
  }, [editData, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.candidate_name.trim()) e.candidate_name = 'Required';
    if (!form.position.trim()) e.position = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.date) e.date = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setSubmitting(true);
    try { await onSubmit(form); onClose(); } catch { /* handled in hook */ } finally { setSubmitting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-[#020617] border border-white/[0.08] rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.6)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_60%)] rounded-2xl pointer-events-none" />
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">{editData ? 'Edit Interview' : 'Add Interview'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{editData ? 'Update interview details' : 'Schedule a new candidate interview'}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-600 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Candidate Name" error={errors.candidate_name}>
                  <input className={inp(errors.candidate_name)} placeholder="John Doe" value={form.candidate_name}
                    onChange={(e) => setForm({ ...form, candidate_name: e.target.value })} />
                </Field>
                <Field label="Position" error={errors.position}>
                  <input className={inp(errors.position)} placeholder="Frontend Developer" value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" error={errors.email}>
                  <input type="email" className={inp(errors.email)} placeholder="john@example.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
                <Field label="Interview Date" error={errors.date}>
                  <input type="date" className={inp(errors.date)} value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </Field>
              </div>
              <Field label="Status">
                <select className={inp()} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
              <Field label="Notes">
                <textarea className={`${inp()} resize-none`} rows={3} placeholder="Add notes..." value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </Field>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 font-medium hover:bg-white/5 transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2">
                  {submitting
                    ? <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />{editData ? 'Updating...' : 'Adding...'}</>
                    : editData ? 'Update Interview →' : 'Add Interview →'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
    {children}
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

const inp = (error) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm text-white transition-all outline-none bg-white/[0.04] placeholder-gray-600 focus:ring-1 ${
    error
      ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20'
      : 'border-white/[0.08] focus:border-white/20 focus:bg-white/[0.06] focus:ring-white/10'
  }`;

export default InterviewModal;
