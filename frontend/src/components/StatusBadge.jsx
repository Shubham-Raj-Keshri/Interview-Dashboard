const STATUS = {
  completed: { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', dot: 'bg-emerald-400' },
  scheduled: { bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400', dot: 'bg-amber-400' },
  pending:   { bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',     dot: 'bg-rose-400' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
