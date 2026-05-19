import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { inquiriesApi } from '../../api/crud';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { SelectInput } from '../../components/forms/FormField';
import Loading from '../../components/common/Loading';
import { useI18n } from '../../i18n/I18nProvider';

export default function InquiriesPage() {
  const { t, localizedField, formatDate } = useI18n();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [viewId, setViewId] = useState(null);
  const qc = useQueryClient();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'fullName', label: t('resources.fields.fullName') },
    { key: 'phone', label: t('resources.fields.phone') },
    { key: 'project', label: t('resources.fields.project'), render: (r) => localizedField(r.project) || '-' },
    { key: 'status', label: t('resources.fields.status'), render: (r) => <StatusBadge status={r.status} /> },
    { key: 'createdAt', label: t('resources.fields.createdAt'), render: (r) => formatDate(r.createdAt) },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ['inquiries', { page, search }],
    queryFn: () => inquiriesApi.getAll({ page, limit: 10, search }).then(r => r.data),
  });

  const { data: inquiryDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['inquiry', viewId],
    queryFn: () => inquiriesApi.getById(viewId).then((r) => r.data.data),
    enabled: !!viewId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => inquiriesApi.patch(id, 'status', { status }),
    onSuccess: () => { qc.invalidateQueries(['inquiries']); toast.success(t('resources.messages.statusUpdated')); setStatusModal(null); },
  });

  const actions = (row) => (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setViewId(row.id)}
        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
        title={t('common.actions.viewDetails')}
        aria-label={t('common.actions.viewDetails')}
      >
        <Eye size={15} />
      </button>
      <button
        type="button"
        onClick={() => { setStatusModal(row); setNewStatus(row.status); }}
        className="p-1.5 text-primary hover:bg-blue-50 rounded"
        title={t('resources.actions.updateStatus')}
        aria-label={t('resources.actions.updateStatus')}
      >
        <RefreshCw size={15} />
      </button>
    </div>
  );

  return (
    <div>
      <PageHeader title={t('resources.resources.inquiries.plural')} />
      <DataTable columns={columns} data={data?.data} meta={data?.meta} loading={isLoading} onPageChange={setPage} onSearch={setSearch} actions={actions} />
      <Modal isOpen={!!statusModal} onClose={() => setStatusModal(null)} title={t('resources.modals.updateInquiryStatus')} size="sm">
        <SelectInput label={t('resources.fields.status')} value={newStatus} onChange={(e) => setNewStatus(e.target.value)} options={[
          { value: 'NEW', label: t('common.statuses.NEW') }, { value: 'CONTACTED', label: t('common.statuses.CONTACTED') },
          { value: 'QUALIFIED', label: t('common.statuses.QUALIFIED') }, { value: 'CLOSED', label: t('common.statuses.CLOSED') }, { value: 'REJECTED', label: t('common.statuses.REJECTED') },
        ]} />
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={() => setStatusModal(null)} className="px-4 py-2 border rounded-lg text-sm">{t('common.actions.cancel')}</button>
          <button onClick={() => statusMutation.mutate({ id: statusModal.id, status: newStatus })} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">{t('common.actions.update')}</button>
        </div>
      </Modal>

      <Modal isOpen={!!viewId} onClose={() => setViewId(null)} title={t('resources.modals.details', { resource: t('resources.resources.inquiries.singular') })} size="lg">
        {detailsLoading ? (
          <Loading />
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                <div className="text-xs text-gray-500 mb-1">{t('common.table.id')}</div>
                <div className="font-semibold ltr break-all">{inquiryDetails?.id || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.fullName')}</div>
                <div className="font-semibold">{inquiryDetails?.fullName || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.phone')}</div>
                <div className="font-semibold ltr">{inquiryDetails?.phone || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.email')}</div>
                <div className="font-semibold">{inquiryDetails?.email || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.status')}</div>
                <div><StatusBadge status={inquiryDetails?.status} /></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.project')}</div>
                <div className="font-semibold">{localizedField(inquiryDetails?.project) || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.unit')}</div>
                <div className="font-semibold">{localizedField(inquiryDetails?.unit) || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.developer')}</div>
                <div className="font-semibold">{localizedField(inquiryDetails?.developer) || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.sourceScreen')}</div>
                <div className="font-semibold">{inquiryDetails?.sourceScreen || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.contactMethod')}</div>
                <div className="font-semibold">
                  {inquiryDetails?.contactMethod === 'CALL' ? t('resources.contactMethods.CALL')
                    : inquiryDetails?.contactMethod === 'WHATSAPP' ? t('resources.contactMethods.WHATSAPP')
                      : inquiryDetails?.contactMethod === 'EMAIL' ? t('resources.contactMethods.EMAIL')
                        : '-'}
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold mb-2">{t('resources.fields.message')}</div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {inquiryDetails?.message || '-'}
              </div>
            </div>

            {inquiryDetails?.notes && (
              <div>
                <div className="text-sm font-bold mb-2">{t('resources.fields.notes')}</div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                  {inquiryDetails.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
