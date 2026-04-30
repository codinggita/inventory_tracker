import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import MainLayout from '../../components/MainLayout';

import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import BASE_URL from '../../services/apiConfig';


import { TrendingUp, Package, Clock, CheckCircle, AlertTriangle, ArrowRight, BarChart2, PieChart, Activity, ShoppingCart, Store, ShieldCheck } from 'lucide-react';


// ── SVG Bar Chart ─────────────────────────────────────────────────────
const BarChart = ({ data = [], valueKey, labelKey, colorFn, height = 160 }) => {
  if (!data || data.length === 0) return <div style={{ height }} className="flex items-center justify-center text-slate-400 italic">No data</div>;
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div className="flex items-end gap-3 w-full" style={{ height }}>
      {data.map((d, i) => {
        const val = d[valueKey] || 0;
        const pct = (val / max) * 100;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-2 group relative">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(pct, 4)}%` }}
              transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
              className={`w-full rounded-t-xl transition-all duration-300 ${colorFn ? colorFn(d, i) : 'bg-slate-200'} shadow-sm group-hover:shadow-emerald-200 group-hover:brightness-110`}
              title={`${d[labelKey]}: ${val}`}
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-black">
              {val}
            </div>
            <span className="text-[10px] font-black text-slate-400 truncate w-full text-center group-hover:text-slate-600">
              {d[labelKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Donut Ring ────────────────────────────────────────────────────────
const DonutRing = ({ value, max, color, label, size = 100 }) => {
  const v = value || 0;
  const m = Math.max(max || 0, 1);
  const pct = Math.min((v / m) * 100, 100);
  const r = 35, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          <motion.circle
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${circ}` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            cx="50" cy="50" r={r} fill="none"
            stroke={color || '#10b981'} strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white leading-none">{Math.round(pct)}%</span>
        </div>
      </div>
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest text-center leading-tight">{label}</span>
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────
const StatCard = ({ title, value, sub, color, icon: Icon }) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber:   'bg-amber-50 text-amber-600 border-amber-100',
    rose:    'bg-rose-50 text-rose-600 border-rose-100',
    teal:    'bg-teal-50 text-teal-600 border-teal-100',
    slate:   'bg-slate-50 text-slate-600 border-slate-100',
  };
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-xl group transition-all"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl border-2 ${colors[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-slate-400 font-bold mt-2 flex items-center gap-1.5">
        <Activity className="w-3 h-3 text-emerald-500" /> {sub}
      </p>}
    </motion.div>
  );
};

// ── Category Demand Bar ───────────────────────────────────────────────
const categoryEmoji = {
  Electronics: '📱', 'Home Appliances': '🏠', Clothing: '👕', Sports: '👟', Gaming: '🎮'
};

const DemandBar = ({ cat, max }) => {
  const pct = Math.max((cat.reservationCount / Math.max(max, 1)) * 100, 2);
  const isHighDemand = cat.reservationCount > 10;
  const isLowStock = cat.totalStock < 5;

  return (
    <div className="group space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg border border-slate-100 group-hover:bg-emerald-50 transition-colors">
            {categoryEmoji[cat.category] || '📦'}
          </div>
          <div>
            <span className="font-black text-slate-900 text-sm block">{cat.category}</span>
            <div className="flex gap-2">
              {isHighDemand && (
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">🔥 High Demand</span>
              )}
              {isLowStock && (
                <span className="text-[8px] font-black text-rose-600 uppercase tracking-wider bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">🚨 Low Stock</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-slate-900">{cat.reservationCount} Holds</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">{cat.totalStock} In Stock</p>
        </div>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={`h-full rounded-full ${isHighDemand ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-300'}`}
        />
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { reservations } = useAppContext();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');


  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/admin/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);


  if (loading || !stats) {
    return (
      <MainLayout>
        <div className="space-y-10 animate-pulse">
          <div className="h-12 bg-slate-200 rounded-2xl w-72" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-slate-100 rounded-[28px]" />)}
          </div>
          <div className="h-80 bg-slate-100 rounded-[40px]" />
        </div>
      </MainLayout>
    );
  }

  const maxDemand = stats?.categoryDemand?.length > 0 
     ? Math.max(...stats.categoryDemand.map(c => c.reservationCount || 0), 1) 
     : 1;
  const totalFulfilled = stats?.reservationStats?.completed || 0;
  const totalExpired  = stats?.reservationStats?.expired   || 0;
  const totalActive   = stats?.activeReservations          || 0;
  const lostDemandCount = stats?.lostDemand?.length        || 0;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-12 py-6">
        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-slate-100 pb-12">
          <div className="space-y-4">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl"
            >
              <PieChart className="w-4 h-4" />
              <span>Business Intelligence Engine</span>
            </motion.div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Market Intelligence</h1>
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-slate-500 text-xl font-medium max-w-2xl">Analyze consumer demand signals to optimize your inventory and maximize revenue.</p>
              {user?.shopName && (
                <div className="flex items-center gap-3 mt-4">
                   <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      {user.shopName}
                   </div>
                   <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Verified Partner
                   </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/inventory">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center space-x-3 group"
              >
                <Package className="w-6 h-6" />
                <span>Update Stock</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>

        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Total Inventory" value={stats?.totalProducts || 0} sub="Live SKUs tracking" color="emerald" icon={Package} />
          <StatCard 
            title="Active Customer Holds" 
            value={reservations.filter(r => r.status === 'active').length} 
            sub="Ready for pickup"
            color="amber" 
            icon={Clock} 
          />
          <StatCard title="Successful Holds" value={totalFulfilled} sub="Approved by you" color="teal" icon={CheckCircle} />
          <StatCard title="Missed Demand" value={lostDemandCount} sub="Out-of-stock losses" color="rose" icon={AlertTriangle} />
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between flex-wrap gap-6 bg-white p-3 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
            {['overview', 'demand', 'trends', 'restock'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-white text-slate-900 shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Live Market Data</span>
          </div>
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Weekly Trend Chart */}
                <div className="lg:col-span-2 bg-white rounded-[48px] border border-slate-100 shadow-2xl p-10 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                        Weekly Market Pulse
                      </h2>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Consumer Interest Timeline</p>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
                      <span className="flex items-center gap-2 text-emerald-600"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Reservations</span>
                      <span className="flex items-center gap-2 text-teal-400"><span className="w-3 h-3 rounded-full bg-teal-300" /> Fulfilled</span>
                    </div>
                  </div>
                  
                  {stats?.weeklyTrend && stats.weeklyTrend.length > 0 && (
                    <div className="flex items-end gap-5 h-64 pt-10">
                      {(() => {
                        const maxVal = Math.max(...stats.weeklyTrend.map(x => x.reservations || 0), 1);
                        return stats.weeklyTrend.map((d, i) => {
                          const resH = ((d.reservations || 0) / maxVal) * 100;
                          const fulH = ((d.fulfilled || 0) / maxVal) * 100;
                          return (
                            <div key={i} className="flex flex-col items-center flex-1 gap-4 group relative">
                              <div className="w-full flex gap-1.5 items-end justify-center" style={{ height: '200px' }}>
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${Math.max(resH, 2)}%` }}
                                  transition={{ duration: 1, delay: i * 0.1 }}
                                  className="w-full bg-emerald-500 rounded-t-xl transition-all duration-300 shadow-lg shadow-emerald-100 group-hover:brightness-110" 
                                />
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${Math.max(fulH, 2)}%` }}
                                  transition={{ duration: 1, delay: i * 0.15 }}
                                  className="w-full bg-teal-300 rounded-t-xl transition-all duration-300 shadow-lg shadow-teal-50 group-hover:brightness-110" 
                                />
                              </div>
                              <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase">{d.day}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>

                {/* Fulfillment Engine */}
                <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-3xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                  <div className="relative z-10 space-y-8">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black">Efficiency Index</h2>
                      <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Hold Fulfill Rate</p>
                    </div>
                    <div className="grid grid-cols-2 gap-10 py-6">
                      <DonutRing value={totalFulfilled} max={totalFulfilled + totalExpired} color="#10b981" label="Fulfilled" />
                      <DonutRing value={totalExpired} max={totalFulfilled + totalExpired} color="#f43f5e" label="Expired" />
                      <DonutRing value={totalActive} max={Math.max(totalActive + totalFulfilled, 1)} color="#f59e0b" label="Pending" />
                      <DonutRing value={stats?.lostDemand?.length || 0} max={Math.max((stats?.lostDemand?.length || 0) + totalFulfilled, 1)} color="#64748b" label="Lost Sale" />
                    </div>
                  </div>
                  <div className="relative z-10 pt-8 border-t border-white/10 text-center space-y-1">
                    <p className="text-6xl font-black text-emerald-400 tracking-tighter">
                      {Math.round((totalFulfilled / Math.max(totalFulfilled + totalExpired, 1)) * 100)}%
                    </p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Customer Satisfaction Score</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── DEMAND TAB ── */}
            {activeTab === 'demand' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Category Sentiment Chart */}
                <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl p-10 space-y-10">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <ShoppingCart className="w-6 h-6 text-emerald-500" />
                      Category Demand Analysis
                    </h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Market Sentiment by Product Group</p>
                  </div>
                  <div className="space-y-8">
                    {stats?.categoryDemand?.length > 0 ? (
                      stats.categoryDemand.map(cat => (
                        <DemandBar key={cat.category} cat={cat} max={maxDemand} />
                      ))
                    ) : (
                      <div className="py-20 text-center text-slate-400 font-bold">No category data available</div>
                    )}
                  </div>
                </div>

                {/* Demand Comparison Graphic */}
                <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl p-10 space-y-10">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <BarChart2 className="w-6 h-6 text-emerald-500" />
                      Demand Heatmap
                    </h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">High vs. Low Interest Comparison</p>
                  </div>
                  
                  <div className="pt-10">
                    {stats?.categoryDemand?.length > 0 ? (
                      <BarChart
                        data={stats.categoryDemand}
                        valueKey="reservationCount"
                        labelKey="category"
                        height={240}
                        colorFn={(d) => d.reservationCount === maxDemand
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                          : d.reservationCount < 5 
                            ? 'bg-gradient-to-t from-slate-200 to-slate-100 group-hover:from-rose-400 group-hover:to-orange-300'
                            : 'bg-gradient-to-t from-slate-300 to-slate-200 group-hover:from-emerald-400 group-hover:to-teal-300'}
                      />
                    ) : (
                      <div className="h-60 flex items-center justify-center text-slate-300 italic">Data visualization unavailable</div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 pt-8 border-t border-slate-50">
                    {(stats?.categoryDemand || []).map(cat => (
                      <div key={cat.category} className="text-center group">
                        <motion.p whileHover={{ scale: 1.2 }} className="text-2xl mb-2">{categoryEmoji[cat.category] || '📦'}</motion.p>
                        <p className="text-[10px] font-black text-slate-400 group-hover:text-slate-900">{cat.reservationCount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TRENDS TAB ── */}
            {activeTab === 'trends' && (
              <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl p-12 space-y-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900">High Interest Assets</h2>
                  <p className="text-slate-400 font-bold text-lg">Top performing products by real-time reservation velocity</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {(() => {
                    const trendingList = (stats?.popularProducts?.length > 0 
                      ? stats.popularProducts 
                      : (stats?.allProductDemand || [])
                    ).filter(Boolean).slice(0, 10);
                    
                    if (trendingList.length === 0) {
                      return <div className="col-span-2 py-20 text-center text-slate-400 font-bold italic">No trending products detected</div>;
                    }

                    const maxCount = trendingList[0]?.reservationCount || 1;
                    const colors = ['from-emerald-500 to-teal-400', 'from-teal-400 to-cyan-400', 'from-cyan-400 to-blue-400', 'from-blue-400 to-violet-400', 'from-violet-400 to-purple-400', 'from-purple-400 to-rose-400', 'from-rose-400 to-orange-400', 'from-orange-400 to-amber-400'];
                    
                    return trendingList.map((product, idx) => {
                      const pct = ((product.reservationCount || 0) / maxCount) * 100;
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={product.id || idx} 
                          className="group flex items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                        >
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center font-black text-slate-300 text-lg group-hover:text-emerald-600 group-hover:scale-110 transition-all">
                            {idx + 1}
                          </div>
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shadow-inner flex-shrink-0 border border-white">
                            {product.image && <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="font-black text-slate-900 text-base truncate tracking-tight">{product.name}</p>
                              <span className="font-black text-emerald-600 text-sm ml-4 whitespace-nowrap bg-emerald-50 px-2 py-1 rounded-lg">
                                {product.reservationCount || 0} scout hits
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(pct, 5)}%` }}
                                transition={{ duration: 1, delay: 0.5 + (idx * 0.05) }}
                                className={`h-full bg-gradient-to-r ${colors[idx % colors.length]} rounded-full`} 
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* ── RESTOCK TAB ── */}
            {activeTab === 'restock' && (
              <div className="space-y-10">
                <div className="bg-gradient-to-br from-rose-600 to-orange-600 rounded-[48px] p-12 text-white shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-white/10">
                        <AlertTriangle className="w-4 h-4 text-white" />
                        <span>Supply Chain Vulnerability</span>
                      </div>
                      <h2 className="text-4xl font-black tracking-tighter">Inventory Risk Assessment</h2>
                      <p className="text-rose-50 text-xl font-medium max-w-xl opacity-90">High-velocity products currently at risk of stock-outs. Immediate replenishment recommended to avoid revenue leakage.</p>
                    </div>
                    <Link to="/admin/inventory">
                      <motion.button 
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-6 bg-white text-rose-600 rounded-[28px] font-black text-xl shadow-2xl shadow-rose-900/40 flex items-center group/btn whitespace-nowrap"
                      >
                        Action Inventory
                        <ArrowRight className="w-6 h-6 ml-4 group-hover/btn:translate-x-2 transition-transform" />
                      </motion.button>
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Critical Asset</th>
                          <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Live Supply</th>
                          <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Market Hits</th>
                          <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Risk Profile</th>
                          <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Supply Chain Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {(stats?.allProductDemand || []).map((product, idx) => {
                          const alertLevel = product.totalStock === 0 ? 'critical' : product.totalStock < 5 ? 'warning' : 'healthy';
                          const alertCfg = {
                            critical: { label: 'Asset Depleted', cls: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' },
                            warning:  { label: 'Supply Shortage', cls: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
                            healthy:  { label: 'Stable Supply', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
                          }[alertLevel] || { label: 'Stable', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
                          return (
                            <motion.tr 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.03 }}
                              key={product.id} 
                              className="group hover:bg-slate-50/80 transition-all cursor-default"
                            >
                              <td className="px-10 py-6">
                                <div className="flex items-center gap-5">
                                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform flex-shrink-0">
                                    {product.image && <img src={product.image} alt="" className="w-full h-full object-cover" />}
                                  </div>
                                  <div>
                                    <p className="font-black text-slate-900 text-base leading-tight tracking-tight">{product.name}</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{product.category}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-10 py-6 text-center">
                                <span className={`text-2xl font-black ${product.totalStock === 0 ? 'text-rose-600' : product.totalStock < 5 ? 'text-amber-600' : 'text-slate-900'}`}>
                                  {product.totalStock}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 block mt-1 uppercase tracking-widest">Units</span>
                              </td>
                              <td className="px-10 py-6 text-center">
                                <span className="text-xl font-black text-slate-700">{product.demandHits}</span>
                                <span className="text-[10px] font-black text-slate-400 block mt-1 uppercase tracking-widest">Hits</span>
                              </td>
                              <td className="px-10 py-6 text-center">
                                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black border-2 flex items-center justify-center gap-2 mx-auto w-fit uppercase tracking-widest ${alertCfg.cls}`}>
                                  <span className={`w-2 h-2 rounded-full ${alertCfg.dot} ${alertLevel !== 'healthy' && 'animate-pulse'}`} />
                                  {alertCfg.label}
                                </span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                <Link to="/admin/inventory">
                                  <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    className="px-6 py-3 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
                                  >
                                    Restock Now
                                  </motion.button>
                                </Link>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
