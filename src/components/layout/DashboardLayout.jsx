import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useI18n } from '../../i18n/I18nProvider';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isRtl } = useI18n();

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={isRtl ? 'lg:mr-64' : 'lg:ml-64'}>
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
