import CrudListPage from '../../components/common/CrudListPage';
import { unitsApi } from '../../api/crud';
import { BooleanBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export default function UnitsList() {
  const { t, localizedField, formatCurrency, formatNumber } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.unit'), render: (r) => localizedField(r) || '-' },
    { key: 'code', label: t('resources.fields.code') },
    { key: 'project', label: t('resources.fields.project'), render: (r) => localizedField(r.project) || '-' },
    { key: 'unitType', label: t('resources.fields.unitType'), render: (r) => localizedField(r.unitType) || '-' },
    { key: 'unitCategory', label: t('resources.fields.unitCategory'), render: (r) => (r.unitCategory ? localizedField(r.unitCategory) : '-') },
    { key: 'price', label: t('resources.fields.price'), render: (r) => r.price ? formatCurrency(r.price) : '-' },
    { key: 'bedrooms', label: t('resources.fields.bedrooms') },
    { key: 'builtArea', label: t('resources.fields.builtArea'), render: (r) => r.builtArea ? `${formatNumber(r.builtArea)} m²` : '-' },
    { key: 'isAvailable', label: t('resources.fields.isAvailable'), render: (r) => <BooleanBadge value={r.isAvailable} /> },
  ];

  return (
    <CrudListPage title={t('resources.resources.units.plural')} queryKey="units" apiFn={unitsApi} columns={columns} createPath="/units/create" createLabel={t('resources.resources.units.create')} searchPlaceholder={t('resources.placeholders.searchByNameOrCode')} />
  );
}
