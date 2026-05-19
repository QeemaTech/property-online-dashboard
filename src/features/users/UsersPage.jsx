import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Trash2, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import { mobileUsersApi } from '../../api/crud';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { SelectInput } from '../../components/forms/FormField';
import { useI18n } from '../../i18n/I18nProvider';

export default function UsersPage() {
  const { t, formatDate } = useI18n();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewId, setViewId] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [deleteId, setDeleteId] = useState(null);
  const qc = useQueryClient();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'fullName', label: t('resources.fields.fullName'), render: (r) => r.fullName || '-' },
    { key: 'phone', label: t('resources.fields.phone') },
    { key: 'email', label: t('resources.fields.email'), render: (r) => r.email || '-' },
    { key: 'language', label: t('resources.fields.language') },
    { key: 'status', label: t('resources.fields.status'), render: (r) => <StatusBadge status={r.status} /> },
    { key: 'createdAt', label: t('resources.fields.createdAt'), render: (r) => formatDate(r.createdAt) },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ['users', { page, search }],
    queryFn: () => mobileUsersApi.getAll({ page, limit: 10, search }).then(r => r.data),
  });

  const { data: userDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['user', viewId],
    queryFn: () => mobileUsersApi.getById(viewId).then((r) => r.data.data),
    enabled: !!viewId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => mobileUsersApi.patch(id, 'status', { status }),
    onSuccess: () => {
      qc.invalidateQueries(['users']);
      toast.success(t('resources.messages.userStatusUpdated'));
      setStatusModal(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.errors.generic')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => mobileUsersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries(['users']);
      toast.success(t('resources.messages.userDeleted'));
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.errors.generic')),
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
        onClick={() => {
          setStatusModal(row);
          setNewStatus(row.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED');
        }}
        className="p-1.5 text-primary hover:bg-blue-50 rounded"
        title={row.status === 'SUSPENDED' ? t('resources.actions.activate') : t('resources.actions.suspend')}
        aria-label={row.status === 'SUSPENDED' ? t('resources.actions.activate') : t('resources.actions.suspend')}
      >
        {row.status === 'SUSPENDED' ? <UserCheck size={15} /> : <UserX size={15} />}
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
      <PageHeader title={t('resources.resources.users.plural')} />
      <DataTable
        columns={columns}
        data={data?.data}
        meta={data?.meta}
        loading={isLoading}
        onPageChange={setPage}
        onSearch={setSearch}
        searchPlaceholder={t('resources.placeholders.searchByNameOrPhone')}
        actions={actions}
      />

      <Modal isOpen={!!viewId} onClose={() => setViewId(null)} title={t('resources.modals.details', { resource: t('resources.resources.users.singular') })} size="lg">
        {detailsLoading ? (
          <Loading />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                <div className="text-xs text-gray-500 mb-1">{t('common.table.id')}</div>
                <div className="font-semibold ltr break-all">{userDetails?.id || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.fullName')}</div>
                <div className="font-semibold">{userDetails?.fullName || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.phone')}</div>
                <div className="font-semibold ltr">{userDetails?.phone || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.email')}</div>
                <div className="font-semibold">{userDetails?.email || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.language')}</div>
                <div className="font-semibold">{userDetails?.language || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.status')}</div>
                <div><StatusBadge status={userDetails?.status} /></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('resources.fields.notifications')}</div>
                <div className="font-semibold">{userDetails?.notificationsEnabled ? t('common.booleans.enabled') : t('common.booleans.disabled')}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">{t('resources.stats.statistics')}</div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div><span className="text-gray-500">{t('resources.stats.favorites')}:</span> <span className="font-bold">{userDetails?._count?.favorites ?? 0}</span></div>
                <div><span className="text-gray-500">{t('resources.stats.inquiries')}:</span> <span className="font-bold">{userDetails?._count?.inquiries ?? 0}</span></div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!statusModal} onClose={() => setStatusModal(null)} title={t('resources.modals.updateUserStatus')} size="sm">
        <SelectInput
          label={t('resources.fields.status')}
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          options={[
            { value: 'ACTIVE', label: t('common.statuses.ACTIVE') },
            { value: 'SUSPENDED', label: t('common.statuses.SUSPENDED') },
          ]}
        />
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={() => setStatusModal(null)} className="px-4 py-2 border rounded-lg text-sm">{t('common.actions.cancel')}</button>
          <button
            onClick={() => statusMutation.mutate({ id: statusModal.id, status: newStatus })}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50"
            disabled={statusMutation.isPending}
          >
            {t('common.actions.update')}
          </button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title={t('resources.modals.deleteUser')}
        message={t('resources.modals.deleteUserMessage')}
      />
    </div>
  );
}
