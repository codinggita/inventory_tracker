import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, ArrowRight, ShieldCheck, Mail, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { getRegisteredUsers, saveRegisteredUsers } from './Signup';

const VerificationPending = () => {
  const { user, logout, setAuth } = useAuth();
  const navigate = useNavigate();

  // Simulation: Auto-approve after 5 seconds for demo purposes
  useEffect(() => {
    if (user?.role === 'pendingDealer') {
      const timer = setTimeout(() => {
        const users = getRegisteredUsers();
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            return { ...u, role: 'dealer', verificationStatus: 'approved' };
          }
          return u;
        });
        
        saveRegisteredUsers(updatedUsers);
        
        const approvedUser = updatedUsers.find(u => u.id === user.id);
        setAuth(approvedUser, 'mock-jwt-' + approvedUser.id);
        
        toast.success('Your business account has been approved!', {
          description: 'Redirecting to your dashboard...',
        });
        
        navigate('/admin');
      }, 2000); // Reduced to 2 seconds for better experience
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate, login]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full bg-white/80 backdrop-blur-2xl rounded-[48px] shadow-2xl p-10 md:p-12 space-y-10 border border-white/60 relative z-10 text-center"
      >
        <div className="space-y-6">
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 bg-amber-100 rounded-[32px] flex items-center justify-center mx-auto text-amber-600 border-2 border-amber-200"
          >
            <Clock className="w-12 h-12" />
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Verification Pending</h2>
            <p className="text-slate-500 font-bold text-lg">Your business account is under review</p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-[32px] p-8 border border-emerald-100 space-y-4 text-left">
          <div className="flex items-start gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-slate-800">Security First</p>
              <p className="text-sm text-slate-600 font-medium">We manually verify every dealer to maintain the highest quality of inventory intelligence for our users.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm text-emerald-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-slate-800">Notification</p>
              <p className="text-sm text-slate-600 font-medium">You will receive an email once our team has verified your license and shop details.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Finalizing security checks...</span>
          </div>
          <p className="text-xs text-slate-400 font-black uppercase tracking-widest italic">(DUMMY DATA MODE: AUTO-APPROVING...)</p>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
          <Link to="/home">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center space-x-3 group"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>Explore as Guest</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full py-4 text-slate-400 font-black hover:text-red-500 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationPending;
