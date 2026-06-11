import { useState } from 'react';
import { Pencil } from 'lucide-react';
import CrudListPage from '../../components/common/CrudListPage';
import Modal from '../../components/common/Modal';
import { projectsApi } from '../../api/crud';
import { StatusBadge } from '../../components/common/Badge';
import { BooleanBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';
import ProjectForm from './ProjectForm';

export default function ProjectsList() {
  const { t, localizedField, formatCurrency } = useI18n();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formEditId, setFormEditId] = useState(null);

  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.project'), render: (r) => localizedField(r) || '-' },
    { key: 'developer', label: t('resources.fields.developer'), render: (r) => localizedField(r.developer) || '-' },
    { key: 'city', label: t('resources.fields.city'), render: (r) => localizedField(r.city) || '-' },
    { key: 'startingPrice', label: t('resources.fields.startingPrice'), render: (r) => r.startingPrice ? formatCurrency(r.startingPrice) : '-' },
    { key: 'status', label: t('resources.fields.status'), render: (r) => <StatusBadge status={r.status} /> },
    { key: 'isFeatured', label: t('resources.fields.isFeatured'), render: (r) => <BooleanBadge value={r.isFeatured} falseVariant="default" /> },
  ];

  const openCreate = () => { setFormEditId(null); setFormModalOpen(true); };
  const openEdit = (row) => { setFormEditId(row.id); setFormModalOpen(true); };
  const closeForm = () => { setFormModalOpen(false); setFormEditId(null); };

  return (
    <>
      <CrudListPage
        title={t('resources.resources.projects.plural')}
        queryKey="projects"
        apiFn={projectsApi}
        columns={columns}
        searchPlaceholder={t('resources.placeholders.searchByName')}
        onCreateClick={openCreate}
        actions={(row) => (
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => openEdit(row)} className="p-1.5 text-primary hover:bg-blue-50 rounded" title={t('common.actions.edit')}>
              <Pencil size={15} />
            </button>
          </div>
        )}
      />
      <Modal isOpen={formModalOpen} onClose={closeForm} title={formEditId ? t('common.forms.editTitle', { resource: t('resources.resources.projects.singular') }) : t('common.forms.addTitle', { resource: t('resources.resources.projects.singular') })} size="xl">
        <ProjectForm modalId={formEditId} onSuccess={closeForm} onCancel={closeForm} />
      </Modal>
    </>
  );
}
