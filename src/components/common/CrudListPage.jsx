import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from './PageHeader';
import DataTable from '../tables/DataTable';
import Modal, { ConfirmModal } from './Modal';
import Loading from './Loading';
import { SubmitButton } from '../forms/FormField';
import { useI18n } from '../../i18n/I18nProvider';

function DetailValue({ column, row, t, localizedField }) {
  const value = row?.[column.key];
  if (column.render) return column.render(row);
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? t('common.booleans.yes') : t('common.booleans.no');
  if (typeof value === 'object') return localizedField(value) || localizedField(value, 'title') || value.id || '-';
  return String(value);
}

export default function CrudListPage({ title, queryKey, apiFn, columns, createPath, createLabel, searchPlaceholder, extraParams = {}, actions: extraActions, formFields, initialFormData, transformSubmit, onCreateClick }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [viewRow, setViewRow] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formEditId, setFormEditId] = useState(null);
  const [formData, setFormData] = useState(initialFormData || {});
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { t, localizedField } = useI18n();

  const isFormEdit = !!formEditId;
  const params = { page, limit: 10, search, ...extraParams };
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => apiFn.getAll(params).then((r) => r.data),
    keepPreviousData: true,
  });

  const { data: details, isFetching: detailsLoading } = useQuery({
    queryKey: [queryKey, 'details', viewRow?.id],
    queryFn: () => apiFn.getById(viewRow.id).then((r) => r.data.data).catch(() => viewRow),
    enabled: !!viewRow?.id && typeof apiFn.getById === 'function',
    retry: false,
  });

  const { data: formExisting, isFetching: formExistingLoading } = useQuery({
    queryKey: [queryKey, 'form', formEditId],
    queryFn: () => apiFn.getById(formEditId).then((r) => r.data.data),
    enabled: isFormEdit && !!formFields,
  });

  useEffect(() => {
    if (formExisting && isFormEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(formExisting);
    }
  }, [formExisting, isFormEdit]);

  const deleteMutation = useMutation({
    mutationFn: (id) => apiFn.remove(id),
    onSuccess: () => { qc.invalidateQueries([queryKey]); toast.success(t('common.messages.deleted')); setDeleteId(null); },
    onError: (err) => toast.error(err.response?.data?.message || t('common.errors.deleteFailed')),
  });

  const formMutation = useMutation({
    mutationFn: (data) => isFormEdit ? apiFn.update(formEditId, data) : apiFn.create(data),
    onSuccess: () => {
      qc.invalidateQueries([queryKey]);
      toast.success(isFormEdit ? t('common.messages.updated') : t('common.messages.created'));
      setFormModalOpen(false);
      setFormEditId(null);
      setFormData(initialFormData || {});
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.errors.generic')),
  });

  const detailColumns = [{ key: 'id', label: t('common.table.id') }, ...columns.filter((col) => col.key !== 'id')];
  const detailRow = details || viewRow;

  const openCreateModal = () => {
    setFormData(initialFormData || {});
    setFormEditId(null);
    setFormModalOpen(true);
  };

  const openEditModal = (row) => {
    setFormEditId(row.id);
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setFormEditId(null);
    setFormData(initialFormData || {});
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = transformSubmit ? transformSubmit(formData) : formData;
    formMutation.mutate(data);
  };

  const defaultActions = (row) => (
    <div className="flex items-center gap-1">
      {extraActions?.(row)}
      <button type="button" onClick={() => setViewRow(row)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title={t('common.actions.viewDetails')} aria-label={t('common.actions.viewDetails')}>
        <Eye size={15} />
      </button>
      <button type="button" onClick={() => formFields ? openEditModal(row) : navigate(`${createPath?.replace('/create', '')}/${row.id}/edit`)} className="p-1.5 text-primary hover:bg-blue-50 rounded" title={t('common.actions.edit')} aria-label={t('common.actions.edit')}>
        <Pencil size={15} />
      </button>
      <button type="button" onClick={() => setDeleteId(row.id)} className="p-1.5 text-danger hover:bg-red-50 rounded" title={t('common.actions.delete')} aria-label={t('common.actions.delete')}>
        <Trash2 size={15} />
      </button>
    </div>
  );

  return (
    <div>
      <PageHeader title={title} createLabel={createLabel} createPath={formFields || onCreateClick ? undefined : createPath} onCreateClick={onCreateClick || (formFields ? openCreateModal : undefined)} />
      <DataTable columns={columns} data={data?.data} meta={data?.meta} loading={isLoading} onPageChange={setPage} onSearch={setSearch} searchPlaceholder={searchPlaceholder} actions={defaultActions} />
      <Modal isOpen={!!viewRow} onClose={() => setViewRow(null)} title={t('resources.modals.details', { resource: title })} size="lg">
        {detailsLoading ? <Loading /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detailColumns.map((column) => (
              <div key={column.key} className={`bg-gray-50 rounded-lg p-3 ${column.key === 'id' ? 'md:col-span-2' : ''}`}>
                <div className="text-xs text-gray-500 mb-1">{column.label}</div>
                <div className={`font-semibold ${column.key === 'id' ? 'ltr break-all' : ''}`}>
                  <DetailValue column={column} row={detailRow} t={t} localizedField={localizedField} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)} loading={deleteMutation.isPending} />
      {formFields && (
        <Modal isOpen={formModalOpen} onClose={closeFormModal} title={isFormEdit ? t('common.forms.editTitle', { resource: title }) : t('common.forms.addTitle', { resource: title })} size="lg">
          {formExistingLoading ? <Loading /> : (
            <form onSubmit={handleFormSubmit}>
              {formFields(formData, (updater) => {
                setFormData(prev => typeof updater === 'function' ? updater(prev) : updater);
              }, isFormEdit)}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t">
                <SubmitButton loading={formMutation.isPending}>
                  {isFormEdit ? t('common.actions.update') : t('common.actions.create')}
                </SubmitButton>
                <button type="button" onClick={closeFormModal} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer">
                  {t('common.actions.cancel')}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
