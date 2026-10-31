import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { TemplesView } from './components/TemplesView';
import { TempleDetailView } from './components/TempleDetailView';
import { BookingView } from './components/BookingView';
import { DevoteeDashboard } from './components/DevoteeDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { activeView } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7EE] text-[#2A0808]">
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'temples' && <TemplesView />}
        {activeView === 'temple-detail' && <TempleDetailView />}
        {activeView === 'booking' && <BookingView />}
        {activeView === 'devotee' && <DevoteeDashboard />}
        {activeView === 'staff' && <StaffDashboard />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      <Footer />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
