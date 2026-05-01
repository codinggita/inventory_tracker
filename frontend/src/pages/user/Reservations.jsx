import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import MainLayout from '../../components/MainLayout';

import Timer from '../../components/Timer';
import { formatCurrency } from '../../utils/formatters';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag, Clock, CheckCircle2, XCircle, AlertCircle, Calendar, MapPin, Trash2, Check, X } from 'lucide-react';

// ── Status badge config ─────────────────────────────────────────────
const statusConfig = {
  active:    { label: 'Active Hold',      bg: 'bg-emerald-50 text-emerald-700',   dot: 'bg-emerald-500', icon: <Clock className="w-4 h-4" /> },
  confirmed: { label: 'Approved ✓',       bg: 'bg-amber-50 text-amber-700',       dot: 'bg-amber-500',   icon: <CheckCircle2 className="w-4 h-4" /> },
  rejected:  { label: 'Rejected ✗',       bg: 'bg-red-50 text-red-700',           dot: 'bg-red-500',     icon: <XCircle className="w-4 h-4" /> },
  expired:   { label: 'Expired',          bg: 'bg-slate-50 text-slate-500',       dot: 'bg-slate-400',   icon: <AlertCircle className="w-4 h-4" /> },
  reserved:  { label: 'Reserved',         bg: 'bg-blue-50 text-blue-700',         dot: 'bg-blue-500',    icon: <ShoppingBag className="w-4 h-4" /> },
};

// ── Reject Modal ────────────────────────────────────────────────────
const RejectModal = ({ reservation, onConfirm, onClose }) => {
  const [reason, setReason] = useState('');
  const presets = [
    'Item is no longer available',
    'Stock discrepancy found',
    'Duplicate reservation detected',
    'Customer failed verification',
  ];

  const productName = reservation?.product?.name || `Product #${reservation?.productId}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white rounded-[40px] shadow-2xl w-full max-md p-10 space-y-8"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-red-50 rounded-[24px] flex items-center justify-center text-red-600 border-2 border-red-100">
              <XCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Reject Hold</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">
                This action will notify the consumer.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="bg-slate-50 rounded-3xl p-5 flex items-center gap-4 border border-slate-100">
          {reservation?.product?.image && (
            <img src={reservation.product.image} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
          )}
          <div>
            <p className="font-black text-slate-900 leading-tight">{productName}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{reservation?.product?.storeName || 'Main Store'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select a reason</p>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <motion.button
                key={p}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReason(p)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all ${
                  reason === p
                    ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200'
                    : 'bg-white text-slate-600 border-slate-100 hover:border-red-200 hover:text-red-600'
                }`}
              >
                {p}
              </motion.button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          placeholder="Add a custom note..."
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-700 text-sm outline-none focus:border-red-400 focus:ring-8 focus:ring-red-50 transition-all resize-none placeholder:text-slate-300"
        />

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason}
            className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-red-200 hover:bg-red-700 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            Confirm Rejection
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Reservations = () => {
  const { 
    reservations, 
    cancelReservation, 
    confirmReservationByAdmin, 
    rejectReservation 
  } = useAppContext();
  const { user } = useAuth();
  const [rejectTarget, setRejectTarget] = useState(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'dealer';

  const displayReservations = [...reservations].sort((a, b) => 
    new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
  );

  const handleCancel = (id, productName) => {
    cancelReservation(id);
    toast.error(`Reservation for "${productName}" cancelled.`);
  };

  const handleApprove = (id, productName) => {
    confirmReservationByAdmin(id, productName);
    toast.success(`Reservation for "${productName}" approved!`);
  };

  const handleRejectConfirm = (reason) => {
    if (!rejectTarget) return;
    const productName = rejectTarget.product?.name || `Product #${rejectTarget.productId}`;
    rejectReservation(rejectTarget.id, productName, reason);
    setRejectTarget(null);
    toast.error(`Reservation for "${productName}" rejected.`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-12 py-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {isAdmin ? 'Customer Holds' : 'My Reservations'}
            </h1>
            <p className="text-slate-500 font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              {isAdmin 
                ? 'Review and manage active product holds from customers'
                : 'Track and manage your temporary product reservations'}
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-emerald-700 font-black text-2xl">{reservations.length}</span>
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">Total Reservations</span>
          </div>
        </header>

        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {displayReservations.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-32 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm mb-8">
                  <ShoppingBag className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No reservations found</h3>
                <p className="text-slate-500 font-medium">Your scouted items will appear here once you reserve them.</p>
              </motion.div>
            ) : (
              displayReservations.map((res, idx) => {
                const config = statusConfig[res.status] || statusConfig.reserved;
                const isActive = res.status === 'active';
                const productName = res.product?.name || `Product #${res.productId}`;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={res.id}
                    className={`group bg-white rounded-[40px] p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all flex flex-col md:flex-row gap-8 items-center ${!isActive && 'opacity-70'}`}
                  >
                    {/* Product Image */}
                    <div className="w-full md:w-40 h-40 rounded-[32px] bg-slate-50 overflow-hidden shadow-inner border border-slate-100 flex-shrink-0 relative">
                      <img 
                        src={res.product?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6 w-full">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${config.bg}`}>
                              <span className={`w-2 h-2 rounded-full ${config.dot} ${isActive && 'animate-pulse'}`} />
                              {config.label}
                            </span>
                            <span className="text-xs text-slate-400 font-bold bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                              Ref: #{String(res.id).slice(-6)}
                            </span>
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                            {productName}
                          </h3>
                        </div>
                        <div className="text-center md:text-right">
                          <p className="text-3xl font-black text-gradient">{formatCurrency(res.product?.price || 0)}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Reserved Price</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-5 h-5 text-emerald-500" />
                            <span className="text-base font-bold">{res.product?.storeName || 'Main Store'}</span>
                          </div>
                          {isActive && (
                            <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-sm">
                              <Clock className="w-5 h-5" />
                              <Timer expiryTime={res.expiryTime} />
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          {isAdmin && isActive ? (
                            <>
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleApprove(res.id, productName)}
                                className="flex-1 md:w-40 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
                              >
                                <Check className="w-4 h-4" />
                                <span>Approve</span>
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setRejectTarget(res)}
                                className="flex-1 md:w-40 py-4 bg-white text-red-600 border-2 border-red-50 rounded-2xl font-black text-sm hover:bg-red-50 transition-all flex items-center justify-center space-x-2"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Reject</span>
                              </motion.button>
                            </>
                          ) : isActive ? (
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCancel(res.id, productName)}
                              className="w-full md:w-auto px-8 py-4 bg-white text-slate-400 hover:text-red-600 border-2 border-slate-100 hover:border-red-100 rounded-2xl font-black text-sm transition-all flex items-center justify-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Cancel Reservation</span>
                            </motion.button>
                          ) : (
                            <div className="text-slate-400 font-bold text-sm italic">
                              Closed on {new Date(res.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {res.status === 'rejected' && res.reason && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-5 bg-red-50 rounded-2xl text-red-700 text-sm font-bold border border-red-100 flex items-start gap-4"
                        >
                          <AlertCircle className="w-6 h-6 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="uppercase tracking-widest text-[10px] opacity-70">Rejection Reason</p>
                            <p>{res.reason}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {rejectTarget && (
            <RejectModal
              reservation={rejectTarget}
              onClose={() => setRejectTarget(null)}
              onConfirm={handleRejectConfirm}
            />
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default Reservations;
