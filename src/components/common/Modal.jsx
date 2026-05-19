import { X } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg" type="button">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }) {
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || t('common.confirmDelete.title')} size="sm">
      <p className="text-gray-600 mb-6">{message || t('common.confirmDelete.message')}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" type="button">
          {t('common.actions.cancel')}
        </button>
        <button onClick={onConfirm} disabled={loading} className="px-4 py-2 bg-danger text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50" type="button">
          {loading ? t('common.actions.deleting') : t('common.actions.delete')}
        </button>
      </div>
    </Modal>
  );
}
