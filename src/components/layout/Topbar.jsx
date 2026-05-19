import { Languages, LogOut, Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../i18n/I18nProvider';

export default function Topbar({ onMenuToggle }) {
  const { admin, logoutAction } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  return (
    <header className="bg-card shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-gray-100" type="button">
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-700">{t('layout.topbar.title')}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setLanguage(language === 'EN' ? 'AR' : 'EN')}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors"
          type="button"
        >
          <Languages size={16} />
          <span>{language === 'EN' ? t('layout.topbar.switchToArabic') : t('layout.topbar.switchToEnglish')}</span>
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} />
          <span>{admin?.name || t('layout.topbar.adminFallback')}</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-danger hover:text-red-700 transition-colors" type="button">
          <LogOut size={16} />
          <span>{t('layout.topbar.logout')}</span>
        </button>
      </div>
    </header>
  );
}
