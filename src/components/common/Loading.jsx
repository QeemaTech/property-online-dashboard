import { useI18n } from '../../i18n/I18nProvider';

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
    </div>
  );
}

export function EmptyState({ message }) {
  const { t } = useI18n();

  return (
    <div className="text-center py-12">
      <p className="text-gray-400 text-lg">{message || t('common.empty')}</p>
    </div>
  );
}
