import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Shield, Crown, User as UserIcon, LogOut, Menu, X, Ticket, Compass } from 'lucide-react';
import { Role } from '../types';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { currentUser, logout, activeView, setActiveView, loginAsRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleRoleSwitch = (role: Role) => {
    loginAsRole(role);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#240206]/95 backdrop-blur-md border-b-2 border-[#C5A059] text-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveView('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F4E8C1] flex items-center justify-center text-[#240206] shadow-md shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform">
            <Sun className="w-6 h-6 animate-[spin_20s_linear_infinite]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider font-cinzel text-[#F4E8C1] group-hover:text-amber-300 transition-colors">
              DIVYA YATRA
            </h1>
            <p className="text-[10px] sm:text-xs text-[#C5A059] font-medium tracking-widest uppercase">
              Sacred Pilgrimage Portal
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
          <button
            onClick={() => setActiveView('home')}
            className={`transition-colors py-1 border-b-2 ${
              activeView === 'home'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-amber-100 hover:text-[#F4E8C1] border-transparent'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveView('temples')}
            className={`transition-colors py-1 border-b-2 ${
              activeView === 'temples'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-amber-100 hover:text-[#F4E8C1] border-transparent'
            }`}
          >
            Temples of India
          </button>
          <button
            onClick={() => setActiveView('booking')}
            className={`transition-colors py-1 border-b-2 ${
              activeView === 'booking'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-amber-100 hover:text-[#F4E8C1] border-transparent'
            }`}
          >
            Reserve Darshan
          </button>

          {/* Direct Role Dashboards if logged in */}
          {currentUser?.role === 'DEVOTEE' && (
            <button
              onClick={() => setActiveView('devotee')}
              className={`transition-colors py-1 border-b-2 ${
                activeView === 'devotee'
                  ? 'text-[#D4AF37] border-[#D4AF37]'
                  : 'text-amber-100 hover:text-[#F4E8C1] border-transparent'
              }`}
            >
              My Bookings
            </button>
          )}

          {currentUser?.role === 'STAFF' && (
            <button
              onClick={() => setActiveView('staff')}
              className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                activeView === 'staff'
                  ? 'text-[#D4AF37] border-[#D4AF37]'
                  : 'text-amber-100 hover:text-[#F4E8C1] border-transparent'
              }`}
            >
              <Shield className="w-4 h-4 text-[#D4AF37]" /> Staff Desk
            </button>
          )}

          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveView('admin')}
              className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'text-[#D4AF37] border-[#D4AF37]'
                  : 'text-amber-100 hover:text-[#F4E8C1] border-transparent'
              }`}
            >
              <Crown className="w-4 h-4 text-[#D4AF37]" /> Admin Suite
            </button>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="text-xs bg-[#3B040B] text-[#F4E8C1] border border-[#C5A059]/60 px-2.5 py-1.5 rounded flex items-center gap-1.5 hover:border-[#D4AF37] transition-all"
              title="Quickly test as Administrator, Temple Staff, or Devotee"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Role: {currentUser ? currentUser.role : 'Guest'}</span>
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#240206] border-2 border-[#C5A059] rounded-lg shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 text-[#C5A059] font-bold uppercase tracking-wider border-b border-[#3B040B]">
                  Instant Role Preview
                </div>
                <button
                  onClick={() => handleRoleSwitch('DEVOTEE')}
                  className="w-full text-left px-3 py-2 text-amber-50 hover:bg-[#3B040B] flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-[#C5A059]" />
                  <div>
                    <p className="font-semibold">Devotee Pilgrim</p>
                    <p className="text-[10px] text-amber-200/70">devotee@divyayatra.org</p>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('STAFF')}
                  className="w-full text-left px-3 py-2 text-amber-50 hover:bg-[#3B040B] flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="font-semibold">Temple Verification Officer</p>
                    <p className="text-[10px] text-amber-200/70">staff@divyayatra.org</p>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('ADMIN')}
                  className="w-full text-left px-3 py-2 text-amber-50 hover:bg-[#3B040B] flex items-center gap-2"
                >
                  <Crown className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <p className="font-semibold">Chief Administrator</p>
                    <p className="text-[10px] text-amber-200/70">admin@divyayatra.org</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentUser.role === 'ADMIN') setActiveView('admin');
                  else if (currentUser.role === 'STAFF') setActiveView('staff');
                  else setActiveView('devotee');
                }}
                className="flex items-center gap-2 border border-[#C5A059] text-[#F4E8C1] hover:bg-[#3B040B] px-3 py-1.5 rounded text-xs font-semibold transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#240206] font-bold text-xs flex items-center justify-center">
                  {currentUser.fullName[0]}
                </span>
                <span className="max-w-[110px] truncate">{currentUser.fullName.split(' ')[0]}</span>
              </button>

              <button
                onClick={logout}
                className="bg-[#5C0612] hover:bg-[#750A18] text-amber-50 border border-red-800 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="border border-[#C5A059] hover:bg-[#3B040B] text-[#F4E8C1] px-3.5 py-1.5 rounded text-xs font-semibold transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveView('booking')}
                className="bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#F4E8C1] text-[#240206] font-bold px-4 py-1.5 rounded text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" /> Book Darshan
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-amber-100 hover:text-amber-300 p-2 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#240206] border-b-2 border-[#C5A059] px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => {
              setActiveView('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded text-sm text-amber-50 hover:bg-[#3B040B]"
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveView('temples');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded text-sm text-amber-50 hover:bg-[#3B040B]"
          >
            Temples of India
          </button>
          <button
            onClick={() => {
              setActiveView('booking');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded text-sm text-amber-50 hover:bg-[#3B040B]"
          >
            Reserve Darshan
          </button>

          {currentUser?.role === 'DEVOTEE' && (
            <button
              onClick={() => {
                setActiveView('devotee');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded text-sm text-[#D4AF37] hover:bg-[#3B040B]"
            >
              My Bookings
            </button>
          )}

          {currentUser?.role === 'STAFF' && (
            <button
              onClick={() => {
                setActiveView('staff');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded text-sm text-orange-400 hover:bg-[#3B040B]"
            >
              Staff Verification Desk
            </button>
          )}

          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded text-sm text-[#D4AF37] hover:bg-[#3B040B]"
            >
              Admin Suite
            </button>
          )}

          <div className="pt-3 border-t border-[#3B040B] flex flex-col gap-2">
            <p className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">Demo Role Switcher:</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleRoleSwitch('DEVOTEE')}
                className="bg-[#3B040B] text-amber-50 py-1 text-xs rounded border border-[#C5A059]/40"
              >
                Devotee
              </button>
              <button
                onClick={() => handleRoleSwitch('STAFF')}
                className="bg-[#3B040B] text-amber-50 py-1 text-xs rounded border border-[#C5A059]/40"
              >
                Staff
              </button>
              <button
                onClick={() => handleRoleSwitch('ADMIN')}
                className="bg-[#3B040B] text-amber-50 py-1 text-xs rounded border border-[#C5A059]/40"
              >
                Admin
              </button>
            </div>

            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="mt-2 w-full bg-[#5C0612] py-2 rounded text-xs font-bold text-amber-100 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out ({currentUser.fullName.split(' ')[0]})
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="mt-2 w-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#240206] py-2 rounded text-xs font-bold"
              >
                Sign In to Portal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
