import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CrudListPage from '../../components/common/CrudListPage';
import CrudFormPage from '../../components/common/CrudFormPage';
import { areasApi, citiesApi } from '../../api/crud';
import { TextInput, SelectInput, CheckboxInput } from '../../components/forms/FormField';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function AreasListPage() {
  const { t, localizedField } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.nameAr') },
    { key: 'nameEn', label: t('resources.fields.nameEn') },
    { key: 'city', label: t('resources.fields.city'), render: (r) => localizedField(r.city) || '-' },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return <CrudListPage title={t('resources.resources.areas.plural')} queryKey="areas" apiFn={areasApi} columns={columns} createPath="/areas/create" createLabel={t('resources.resources.areas.create')} />;
}

export function AreaFormPage() {
  const { t, localizedField } = useI18n();
  const [form, setForm] = useState({ nameAr: '', nameEn: '', cityId: '', isActive: true, sortOrder: 0 });
  const { data: cities } = useQuery({ queryKey: ['cityAll'], queryFn: () => citiesApi.getAll({ limit: 200 }).then(r => r.data.data) });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const transform = (d) => ({ ...d, cityId: d.cityId, sortOrder: parseInt(d.sortOrder) || 0 });
  return (
    <CrudFormPage title={t('resources.resources.areas.singular')} queryKey="areas" apiFn={areasApi} formData={form} setFormData={(d) => setForm({ ...d, cityId: d.cityId?.toString() || '' })} backPath="/areas" transformSubmit={transform}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={set('nameAr')} required />
        <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={set('nameEn')} required />
        <SelectInput label={t('resources.fields.city')} value={form.cityId} onChange={set('cityId')} options={(cities || []).map(c => ({ value: c.id.toString(), label: localizedField(c) }))} required />
        <TextInput label={t('resources.fields.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
      </div>
      <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
    </CrudFormPage>
  );
}
