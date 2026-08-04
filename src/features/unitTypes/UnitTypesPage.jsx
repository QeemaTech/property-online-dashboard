import CrudListPage from '../../components/common/CrudListPage';
import { unitTypesApi } from '../../api/crud';
import { TextInput, CheckboxInput } from '../../components/forms/FormField';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function UnitTypesListPage() {
  const { t } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.nameAr') },
    { key: 'nameEn', label: t('resources.fields.nameEn') },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return (
    <CrudListPage
      title={t('resources.resources.unitTypes.plural')}
      queryKey="unitTypes"
      apiFn={unitTypesApi}
      columns={columns}
      initialFormData={{ nameAr: '', nameEn: '', titleAr: '', titleEn: '', isActive: true, sortOrder: 0 }}
      transformSubmit={(d) => ({ ...d, sortOrder: parseInt(d.sortOrder) || 0 })}
      formFields={(form, setForm) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
            <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
            <TextInput label={t('resources.fields.titleAr')} value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
            <TextInput label={t('resources.fields.titleEn')} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
            <TextInput label={t('resources.fields.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
          </div>
          <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
        </>
      )}
    />
  );
}

export function UnitTypeFormPage() {
  return null;
}
