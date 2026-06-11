import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export default function PageHeader({ title, createLabel, createPath, onCreateClick, children }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        {children}
        {(createPath || onCreateClick) && (
          onCreateClick ? (
            <button onClick={onCreateClick} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors cursor-pointer">
              <Plus size={16} />
              <span>{createLabel || t('common.actions.addNew')}</span>
            </button>
          ) : (
            <Link to={createPath} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors">
              <Plus size={16} />
              <span>{createLabel || t('common.actions.addNew')}</span>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
