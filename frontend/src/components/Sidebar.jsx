import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';


const Sidebar = () => {
  const { user } = useAuth();
  const { reservations } = useAppContext();
  const isAdmin = user?.role === 'admin' || user?.role === 'dealer';

  const activeReservations = reservations.filter(r => r.status === 'active').length;

  // ─── ADMIN (Business) sidebar links ───────────────────────────────
  const adminLinks = [
    {
      id: 'admin-dashboard', to: '/admin', label: 'Business Dashboard', exact: true,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    {
      id: 'manage-inventory', to: '/admin/inventory', label: 'Manage Inventory',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    },
    {
      id: 'customer-holds', to: '/reservations', label: 'Customer Holds',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
  ];

  // ─── USER (Consumer) sidebar links ───────────────────────────────
  const userLinks = [
    {
      to: '/dashboard', label: 'Dashboard',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    {
      to: '/search', label: 'Search Products',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    },
    {
      to: '/map', label: 'Explore Map',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
    },
    {
      to: '/reservations', label: 'My Reservations',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
  ];

  const activeStyle = 'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-white shadow-lg';
  const inactiveStyle = 'flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all duration-200 font-medium';

  const links = isAdmin ? adminLinks : userLinks;
  const accentColor = isAdmin ? 'from-slate-800 to-slate-900' : 'from-emerald-600 to-teal-700';
  const activeColor = isAdmin ? 'bg-slate-800 shadow-slate-200' : 'bg-emerald-600 shadow-emerald-100';

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex flex-col bg-white border-r border-slate-100 p-6 space-y-8">
      {/* Role Badge */}
      <div className={`px-4 py-3 rounded-2xl bg-gradient-to-r ${accentColor} text-white text-center`}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
          {isAdmin ? 'Business Portal' : 'Consumer Portal'}
        </p>
        <p className="font-black text-sm mt-0.5">
          {isAdmin ? '🏢 Admin View' : '🛍️ Shopper View'}
        </p>
      </div>

      {/* Nav Links */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4 select-none">Menu</h3>
        <nav className="space-y-1.5">
          {links.map((link) => (
            <NavLink
              key={link.id || link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                isActive ? `${activeStyle} ${activeColor}` : inactiveStyle
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Widget */}
      <div className="mt-auto">
        {isAdmin ? (
          <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Customer Holds</p>
            <p className="text-3xl font-black text-emerald-400">{activeReservations}</p>
            <p className="text-xs opacity-50 font-medium">Pending your confirmation</p>
          </div>
        ) : (
          <div className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Your Active Holds</p>
            <p className="text-3xl font-black">{activeReservations}</p>
            <p className="text-xs opacity-60 font-medium">System online & synced</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
