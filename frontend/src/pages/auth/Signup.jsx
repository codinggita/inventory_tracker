import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, ShoppingBag, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Signup = () => {
  const [email, setEmail]       = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [role, setRole]         = useState('user');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { register }            = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (password !== confirm) {
      return setError('Passwords do not match. Please re-enter.');
    }

    setLoading(true);
    try {
      const emailLower = email.toLowerCase().trim();
      const userData = {
        email: emailLower,
        name: username.trim() || 'User',
        password,
        role: role === 'admin' ? 'dealer' : 'user',
      };

      await register(userData);

      toast.success('Account created successfully!');
      
      if (userData.role === 'dealer') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 font-sans relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-lg w-full bg-white/80 backdrop-blur-2xl rounded-[48px] shadow-2xl p-10 md:p-12 space-y-10 border border-white/60 relative z-10"
      >
        {/* Logo + Heading */}
        <div className="text-center space-y-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="w-20 h-20 bg-emerald-600 rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200"
          >
            <ShoppingBag className="w-10 h-10 text-white" />
          </motion.div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Join Shelf Scout</h2>
            <p className="text-slate-500 font-bold">Start your real-time shopping journey today</p>
          </div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-3 bg-red-50 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold border border-red-100"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 text-center">I am a…</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'user', label: '🛍️ Customer', sub: 'Find & reserve' },
                { value: 'admin', label: '🏢 Store Admin', sub: 'Manage inventory' },
              ].map(opt => (
                <motion.button
                  key={opt.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(opt.value)}
                  className={`p-5 rounded-[24px] border-2 text-left transition-all ${
                    role === opt.value
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <p className="font-black text-sm text-slate-800">{opt.label}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{opt.sub}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="text" required
                  className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                  placeholder="ScoutMaster"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="email" required
                  className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                  placeholder="scout@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="password" required minLength={6}
                  className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="password" required
                  className={`block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 rounded-[20px] focus:bg-white outline-none transition-all text-slate-900 font-bold ${
                    confirm && confirm !== password ? 'border-red-300 focus:border-red-500' : 'border-slate-50 focus:border-emerald-500'
                  }`}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-3 group"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-slate-500 font-bold">
          Already a scout? <Link to="/login" className="text-emerald-600 font-black hover:underline underline-offset-4">Log in here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
