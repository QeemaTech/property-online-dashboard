import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { notificationsApi } from '../../api/crud';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import { TextInput, TextArea, SubmitButton } from '../../components/forms/FormField';
import { useI18n } from '../../i18n/I18nProvider';

export default function NotificationsPage() {
  const { t, localizedField, formatDate } = useI18n();
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [viewRow, setViewRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ titleAr: '', titleEn: '', bodyAr: '', bodyEn: '', type: 'GENERAL' });
  const qc = useQueryClient();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'titleAr', label: t('resources.fields.titleAr'), render: (r) => localizedField(r, 'title') || '-' },
    { key: 'type', label: t('resources.fields.type') },
    { key: 'isSent', label: t('resources.fields.isSent'), render: (r) => r.isSent ? t('common.booleans.yes') : t('common.booleans.no') },
    { key: 'createdAt', label: t('resources.fields.createdAt'), render: (r) => formatDate(r.createdAt) },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationsApi.getAll({ page, limit: 10 }).then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (d) => notificationsApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['notifications']); toast.success(t('resources.messages.notificationSent')); setShowCreate(false); setForm({ titleAr: '', titleEn: '', bodyAr: '', bodyEn: '', type: 'GENERAL' }); },
    onError: (err) => toast.error(err.response?.data?.message || t('common.errors.generic')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => notificationsApi.remove(id),
    onSuccess: () => { qc.invalidateQueries(['notifications']); toast.success(t('common.messages.deleted')); setDeleteId(null); },
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const actions = (row) => (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setViewRow(row)}
        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
        title={t('common.actions.viewDetails')}
        aria-label={t('common.actions.viewDetails')}
      >
        <Eye size={15} />
      </button>
      <button
        type="button"
        onClick={() => setDeleteId(row.id)}
        className="p-1.5 text-danger hover:bg-red-50 rounded"
        title={t('common.actions.delete')}
        aria-label={t('common.actions.delete')}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  return (
    <div>
      <PageHeader title={t('resources.resources.notifications.plural')}>
        <button onClick={() => setShowCreate(true)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm">{t('resources.actions.sendNotification')}</button>
      </PageHeader>
      <DataTable columns={columns} data={data?.data} meta={data?.meta} loading={isLoading} onPageChange={setPage} actions={actions} />
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title={t('resources.actions.sendNewNotification')} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.titleAr')} value={form.titleAr} onChange={set('titleAr')} required />
            <TextInput label={t('resources.fields.titleEn')} value={form.titleEn} onChange={set('titleEn')} required />
          </div>
          <TextArea label={t('resources.fields.bodyAr')} value={form.bodyAr} onChange={set('bodyAr')} required />
          <TextArea label={t('resources.fields.bodyEn')} value={form.bodyEn} onChange={set('bodyEn')} required />
          <SubmitButton loading={createMutation.isPending}>{t('resources.actions.sendNotification')}</SubmitButton>
        </form>
      </Modal>
      <Modal isOpen={!!viewRow} onClose={() => setViewRow(null)} title={t('resources.modals.details', { resource: t('resources.resources.notifications.singular') })} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
            <div className="text-xs text-gray-500 mb-1">{t('common.table.id')}</div>
            <div className="font-semibold ltr break-all">{viewRow?.id || '-'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{t('resources.fields.titleAr')}</div>
            <div className="font-semibold">{viewRow?.titleAr || '-'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{t('resources.fields.titleEn')}</div>
            <div className="font-semibold">{viewRow?.titleEn || '-'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{t('resources.fields.type')}</div>
            <div className="font-semibold">{viewRow?.type || '-'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{t('resources.fields.isSent')}</div>
            <div className="font-semibold">{viewRow?.isSent ? t('common.booleans.yes') : t('common.booleans.no')}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{t('resources.fields.createdAt')}</div>
            <div className="font-semibold">{formatDate(viewRow?.createdAt)}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{t('resources.fields.sentAt')}</div>
            <div className="font-semibold">{formatDate(viewRow?.sentAt)}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
            <div className="text-xs text-gray-500 mb-1">{t('resources.fields.bodyAr')}</div>
            <div className="font-semibold whitespace-pre-wrap">{viewRow?.bodyAr || '-'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
            <div className="text-xs text-gray-500 mb-1">{t('resources.fields.bodyEn')}</div>
            <div className="font-semibold whitespace-pre-wrap">{viewRow?.bodyEn || '-'}</div>
          </div>
        </div>
      </Modal>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)} loading={deleteMutation.isPending} />
    </div>
  );
}
