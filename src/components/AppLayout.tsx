import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useHotel } from '@/context/HotelContext';
import {
  LayoutDashboard, BedDouble, UserPlus, LogOut, Search,
  DoorOpen, BarChart3, Mountain
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/rooms', label: 'Room Status', icon: BedDouble },
  { path: '/guest-entry', label: 'New Guest', icon: UserPlus },
  { path: '/checkout', label: 'Checkout', icon: DoorOpen },
  { path: '/records', label: 'Records', icon: Search },
  { path: '/reports', label: 'Reports', icon: BarChart3, adminOnly: true },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, role } = useAuth();
  const { activeBookings } = useHotel();
  const location = useLocation();

  const filteredNav = navItems.filter(item => !item.adminOnly || role === 'admin');

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Luxury Navy Sidebar */}
      <aside className="w-72 bg-navy-gradient text-white flex flex-col shrink-0 shadow-2xl">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
              <Mountain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight font-serif text-white">New Chitwan</h1>
              <p className="text-xs text-amber-200/80 tracking-wider uppercase">Luxury Guest House</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredNav.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group fade-up ${
                  index === 0 ? '' : `fade-up-delay-${Math.min(index, 4)}`
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-lg'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-amber-500/20' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'}`} />
                </div>
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10">
          {/* Stats Card */}
          <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Active Guests</span>
              <span className="text-lg font-bold text-amber-400 font-serif">{activeBookings.length}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Role</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full capitalize border border-amber-500/30">
                {role}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-slate-300 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/20 border border-transparent transition-all duration-300 group"
          >
            <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-all">
              <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-400" />
            </div>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <div className="min-h-full flex-1 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
        
        {/* Luxury Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-xs text-slate-500">New Chitwan Luxury Guest House</span>
            <span className="text-xs text-slate-400 font-medium">Created by Rahul GC © 2026</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AppLayout;
