import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { getRegisteredUsers } from './Signup';
import { Mail, Lock, Building2, ArrowRight, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const users = getRegisteredUsers();
      const emailLower = email.toLowerCase().trim();

      const account = users.find(u => u.email === emailLower);

      if (!account) {
        setError('No business account found with this email.');
        setLoading(false);
        return;
      }

      if (account.role !== 'dealer' && account.role !== 'admin' && account.role !== 'pendingDealer') {
        setError('This email is not registered as a business account.');
        setLoading(false);
        return;
      }

      if (account.password !== password) {
        setError('Incorrect password. Please try again.');
        setLoading(false);
        return;
      }

      const { password: _pw, ...safeUser } = account;
      login(safeUser, 'mock-jwt-' + account.id);
      
      toast.success(`Welcome back, ${account.name}!`);

      if (account.role === 'pendingDealer') {
        navigate('/verification-pending');
      } else {
        navigate('/admin');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 font-sans relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900/40 backdrop-blur-2xl rounded-[48px] shadow-2xl p-10 md:p-12 space-y-10 border border-white/10 relative z-10"
      >
        {/* Logo + Heading */}
        <div className="text-center space-y-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-20 h-20 bg-emerald-600 rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 border border-emerald-400/20"
          >
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tight">Business Login</h2>
            <p className="text-slate-400 font-bold">Manage your store and inventory</p>
          </div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-3 bg-red-500/10 text-red-400 px-6 py-4 rounded-2xl text-sm font-bold border border-red-500/20"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Business Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="email" required
                  className="block w-full pl-14 pr-5 py-4 bg-slate-800/50 border-2 border-slate-700/50 rounded-[20px] focus:bg-slate-800 focus:border-emerald-500 outline-none transition-all text-white font-bold"
                  placeholder="admin@store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="password" required
                  className="block w-full pl-14 pr-5 py-4 bg-slate-800/50 border-2 border-slate-700/50 rounded-[20px] focus:bg-slate-800 focus:border-emerald-500 outline-none transition-all text-white font-bold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-3 group"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span>Enter Admin Panel</span>
                <ShieldCheck className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="pt-6 border-t border-white/5 space-y-4 text-center">
          <p className="text-slate-500 font-bold">
            Not a business partner? <Link to="/login" className="text-emerald-500 font-black hover:underline underline-offset-4">Consumer Login</Link>
          </p>
          <Link to="/signup" className="block text-xs font-black text-slate-600 uppercase tracking-widest hover:text-emerald-500 transition-colors">
            Register your business →
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
