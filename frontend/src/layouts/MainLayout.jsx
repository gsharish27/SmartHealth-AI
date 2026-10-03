import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import HealthRecordFormModal from '../components/records/HealthRecordFormModal';
import { healthRecordsApi } from '../api/healthRecordsApi';

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);

  const handleQuickLogVitals = async (payload) => {
    try {
      await healthRecordsApi.createRecord(payload);
      setLogModalOpen(false);
      window.location.reload(); // Refresh data smoothly
    } catch (err) {
      alert(err.message || 'Failed to log health record');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Navbar
        onOpenLogModal={() => setLogModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0 space-y-6">
          {children}
        </main>
      </div>

      <HealthRecordFormModal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        onSubmit={handleQuickLogVitals}
      />
    </div>
  );
}
