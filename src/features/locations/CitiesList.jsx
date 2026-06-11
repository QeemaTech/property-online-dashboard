import { useQuery } from '@tanstack/react-query';
import CrudListPage from '../../components/common/CrudListPage';
import { citiesApi, countriesApi } from '../../api/crud';
import { TextInput, SelectInput, CheckboxInput } from '../../components/forms/FormField';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function CitiesListPage() {
  const { t, localizedField } = useI18n();
  const { data: countries } = useQuery({ queryKey: ['cList'], queryFn: () => countriesApi.getAll({ limit: 100 }).then(r => r.data.data) });
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.nameAr') },
    { key: 'nameEn', label: t('resources.fields.nameEn') },
    { key: 'country', label: t('resources.fields.country'), render: (r) => localizedField(r.country) || '-' },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return (
    <CrudListPage
      title={t('resources.resources.cities.plural')}
      queryKey="cities"
      apiFn={citiesApi}
      columns={columns}
      initialFormData={{ nameAr: '', nameEn: '', countryId: '', isActive: true, sortOrder: 0 }}
      transformSubmit={(d) => ({ ...d, countryId: d.countryId, sortOrder: parseInt(d.sortOrder) || 0 })}
      formFields={(form, setForm) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
            <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
            <SelectInput label={t('resources.fields.country')} value={form.countryId} onChange={(e) => setForm({ ...form, countryId: e.target.value })} options={(countries || []).map(c => ({ value: c.id.toString(), label: localizedField(c) }))} required />
            <TextInput label={t('resources.fields.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
          </div>
          <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
        </>
      )}
    />
  );
}

export function CityFormPage() {
  return null;
}
