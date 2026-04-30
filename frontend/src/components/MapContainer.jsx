import React from 'react';
import { useAppContext } from '../context/AppContext';


const MapContainer = ({ stores = [], onSelectStore }) => {
  const { location: userLocation } = useAppContext();
  
  // Use the first store or provided default center (23.2269123, 72.5090304)
  const centerStore = stores.length > 0 ? stores[0] : null;
  const defaultLat = 23.2269123;
  const defaultLng = 72.5090304;

  const mapUrl = centerStore 
    ? `https://maps.google.com/maps?q=${centerStore.lat},${centerStore.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${defaultLat},${defaultLng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full h-full bg-slate-50 relative overflow-hidden group">
      {/* Real Google Map Embed */}
      <iframe
        width="100%"
        height="100%"
        id="gmap_canvas"
        src={mapUrl}
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        className="grayscale-[10%] contrast-[1.1] brightness-[1.02]"
      ></iframe>

      {/* Overlay Panels */}
      <div className="absolute top-6 right-6 flex flex-col space-y-3">
        {/* Live Location Tracker Panel */}
        <div className="bg-slate-900/90 backdrop-blur-xl px-5 py-4 rounded-3xl shadow-2xl border border-white/10 animate-in">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Tracker Active</span>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Your Location:</p>
            <p className="text-xs font-mono text-emerald-400 font-bold">
              {userLocation && userLocation.lat && userLocation.lng 
                ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` 
                : 'Searching...'}
            </p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md px-5 py-4 rounded-3xl shadow-2xl border border-white/20 flex items-center space-x-3 animate-in delay-100">
          <div className="bg-blue-500 p-1.5 rounded-lg shadow-lg shadow-blue-200">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">
            {stores.length} Shops Available
          </span>
        </div>
      </div>

      {/* Map Hint Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        Interactive Satellite Sync
      </div>
    </div>
  );
};

export default MapContainer;
