import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ShoppingBag, ArrowRight, ArrowLeft, Store, User, FileText, MapPin, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { saveRegisteredUsers, getRegisteredUsers } from './Signup';

const BusinessVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const { newUser } = location.state || {};

  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    licenseNumber: '',
    storeAddress: '',
    contactNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');

  if (!newUser) {
    navigate('/signup');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate multi-stage verification for dummy data
    const stages = [
      'Validating GST/License Number...',
      'Verifying Shop Address...',
      'Checking Business Reputation...',
      'Finalizing Verification...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setLoadingStage(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const existing = getRegisteredUsers();
      const finalUser = {
        ...newUser,
        businessDetails: { ...formData },
        role: 'pendingDealer',
        verificationStatus: 'pending',
      };

      saveRegisteredUsers([...existing, finalUser]);

      const { password: _pw, ...safeUser } = finalUser;
      setAuth(safeUser, 'mock-jwt-' + finalUser.id);

      toast.success('Verification Step Complete!', {
        description: 'Your credentials have been pre-verified.',
      });

      navigate('/verification-pending');
    } catch (err) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-white/80 backdrop-blur-2xl rounded-[48px] shadow-2xl p-10 md:p-12 space-y-10 border border-white/60 relative z-10"
      >
        <div className="text-center space-y-4">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-20 h-20 bg-emerald-600 rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200"
          >
            <Store className="w-10 h-10 text-white" />
          </motion.div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Business Verification</h2>
            <p className="text-slate-500 font-bold text-lg">Tell us about your store to get started</p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shop Name */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Shop Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  name="shopName" required
                  type="text"
                  className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                  placeholder="Scout Electronics"
                  value={formData.shopName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Owner Name */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Owner Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  name="ownerName" required
                  type="text"
                  className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                  placeholder="John Doe"
                  value={formData.ownerName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">License / GST Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  name="licenseNumber" required
                  type="text"
                  className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                  placeholder="GSTIN1234567890"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  name="contactNumber" required
                  type="tel"
                  className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                  placeholder="+91 98765 43210"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Store Address */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Store Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <textarea
                name="storeAddress" required
                rows={3}
                className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[24px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold resize-none"
                placeholder="123, Business Park, Kalol, Gujarat"
                value={formData.storeAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="flex-1 py-5 bg-slate-100 text-slate-700 rounded-[24px] font-black text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Back</span>
            </button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-[2] py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all flex flex-col items-center justify-center space-y-1 group min-h-[80px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-[10px] uppercase tracking-widest opacity-80">{loadingStage}</span>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <span>Submit for Review</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BusinessVerification;
