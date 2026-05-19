import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CrudListPage from '../../components/common/CrudListPage';
import CrudFormPage from '../../components/common/CrudFormPage';
import { citiesApi, countriesApi } from '../../api/crud';
import { TextInput, SelectInput, CheckboxInput } from '../../components/forms/FormField';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function CitiesListPage() {
  const { t, localizedField } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.nameAr') },
    { key: 'nameEn', label: t('resources.fields.nameEn') },
    { key: 'country', label: t('resources.fields.country'), render: (r) => localizedField(r.country) || '-' },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return <CrudListPage title={t('resources.resources.cities.plural')} queryKey="cities" apiFn={citiesApi} columns={columns} createPath="/cities/create" createLabel={t('resources.resources.cities.create')} />;
}

export function CityFormPage() {
  const { t, localizedField } = useI18n();
  const [form, setForm] = useState({ nameAr: '', nameEn: '', countryId: '', isActive: true, sortOrder: 0 });
  const { data: countries } = useQuery({ queryKey: ['cList'], queryFn: () => countriesApi.getAll({ limit: 100 }).then(r => r.data.data) });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const transform = (d) => ({ ...d, countryId: d.countryId, sortOrder: parseInt(d.sortOrder) || 0 });
  return (
    <CrudFormPage title={t('resources.resources.cities.singular')} queryKey="cities" apiFn={citiesApi} formData={form} setFormData={(d) => setForm({ ...d, countryId: d.countryId?.toString() || '' })} backPath="/cities" transformSubmit={transform}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={set('nameAr')} required />
        <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={set('nameEn')} required />
        <SelectInput label={t('resources.fields.country')} value={form.countryId} onChange={set('countryId')} options={(countries || []).map(c => ({ value: c.id.toString(), label: localizedField(c) }))} required />
        <TextInput label={t('resources.fields.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
      </div>
      <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
    </CrudFormPage>
  );
}
