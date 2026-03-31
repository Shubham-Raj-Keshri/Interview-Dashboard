import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', type: 'text', label: 'Full Name', placeholder: 'Jane Smith' },
    { key: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com' },
    { key: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Radial glow top center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
      {/* Subtle purple accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-sm"
      >
        {/* Logo + Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex w-11 h-11 bg-white rounded-2xl items-center justify-center mb-5 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">LearnKaro <span className="text-white/50">Hiring</span></h1>
          <p className="text-gray-500 text-sm mt-2">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ key, type, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
                <input
                  type={type} required placeholder={placeholder}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              type="submit" disabled={loading}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] disabled:opacity-50 transition-all mt-1 text-sm tracking-wide"
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white/70 hover:text-white font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
