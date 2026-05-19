import CrudListPage from '../../components/common/CrudListPage';
import { developersApi } from '../../api/crud';
import { ActiveBadge, BooleanBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export default function DevelopersList() {
  const { t } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.nameAr') },
    { key: 'nameEn', label: t('resources.fields.nameEn') },
    { key: 'numberOfProjects', label: t('resources.resources.projects.plural'), render: (r) => r.numberOfProjects || r._count?.projects || 0 },
    { key: 'isFeatured', label: t('resources.fields.isFeatured'), render: (r) => <BooleanBadge value={r.isFeatured} falseVariant="default" /> },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return (
    <CrudListPage
      title={t('resources.resources.developers.plural')}
      queryKey="developers"
      apiFn={developersApi}
      columns={columns}
      createPath="/developers/create"
      createLabel={t('resources.resources.developers.create')}
      searchPlaceholder={t('resources.placeholders.searchByName')}
    />
  );
}
