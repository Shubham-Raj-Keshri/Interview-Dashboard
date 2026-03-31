import StatusBadge from './StatusBadge';

const InterviewCard = ({ interview, onEdit, onDelete }) => {
  const { candidate_name, position, email, status, date, notes } = interview;

  return (
    <div className="bg-black border border-white/8 rounded-2xl p-5 hover:border-indigo-500/30 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)] transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-black text-sm flex-shrink-0 shadow-[0_0_12px_rgba(255,255,255,0.15)]">
            {candidate_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{candidate_name}</h3>
            <p className="text-xs text-gray-500">{position}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="space-y-1.5 text-xs text-gray-600 mb-4">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          {email}
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        {notes && <p className="text-gray-600 truncate">{notes}</p>}
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(interview)}
          className="flex-1 py-1.5 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-colors">
          Edit
        </button>
        <button onClick={() => onDelete(interview._id)}
          className="flex-1 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;
