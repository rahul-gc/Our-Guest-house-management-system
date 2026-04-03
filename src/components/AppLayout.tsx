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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-secondary-foreground flex flex-col shrink-0">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Mountain className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold leading-tight">New Chitwan</h1>
              <p className="text-xs opacity-80">Guest House</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {filteredNav.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs opacity-70">Guests: {activeBookings.length}</span>
            <span className="text-xs bg-sidebar-primary/20 text-sidebar-primary-foreground px-2 py-0.5 rounded-full capitalize">
              {role}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium w-full text-sidebar-foreground hover:bg-sidebar-accent transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <div className="dhaka-pattern min-h-full flex-1">
          <div className="p-8">
            {children}
          </div>
        </div>
        
        {/* Footer with watermark */}
        <footer className="bg-secondary/50 border-t border-sidebar-border py-4 px-8">
          <div className="text-center text-xs">
            <span className="text-foreground/80 font-medium">Created by Rahul GC © 2026</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AppLayout;
