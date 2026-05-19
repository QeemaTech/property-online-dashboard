import CrudListPage from '../../components/common/CrudListPage';
import { projectsApi } from '../../api/crud';
import { StatusBadge } from '../../components/common/Badge';
import { BooleanBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export default function ProjectsList() {
  const { t, localizedField, formatCurrency } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.project'), render: (r) => localizedField(r) || '-' },
    { key: 'developer', label: t('resources.fields.developer'), render: (r) => localizedField(r.developer) || '-' },
    { key: 'city', label: t('resources.fields.city'), render: (r) => localizedField(r.city) || '-' },
    { key: 'startingPrice', label: t('resources.fields.startingPrice'), render: (r) => r.startingPrice ? formatCurrency(r.startingPrice) : '-' },
    { key: 'status', label: t('resources.fields.status'), render: (r) => <StatusBadge status={r.status} /> },
    { key: 'isFeatured', label: t('resources.fields.isFeatured'), render: (r) => <BooleanBadge value={r.isFeatured} falseVariant="default" /> },
  ];

  return (
    <CrudListPage
      title={t('resources.resources.projects.plural')}
      queryKey="projects"
      apiFn={projectsApi}
      columns={columns}
      createPath="/projects/create"
      createLabel={t('resources.resources.projects.create')}
      searchPlaceholder={t('resources.placeholders.searchByName')}
    />
  );
}
