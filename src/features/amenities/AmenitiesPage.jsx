import { useState } from 'react';
import CrudListPage from '../../components/common/CrudListPage';
import CrudFormPage from '../../components/common/CrudFormPage';
import { amenitiesApi } from '../../api/crud';
import { TextInput, CheckboxInput } from '../../components/forms/FormField';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function AmenitiesListPage() {
  const { t } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.nameAr') },
    { key: 'nameEn', label: t('resources.fields.nameEn') },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return <CrudListPage title={t('resources.resources.amenities.plural')} queryKey="amenities" apiFn={amenitiesApi} columns={columns} createPath="/amenities/create" createLabel={t('resources.resources.amenities.create')} />;
}

export function AmenityFormPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ nameAr: '', nameEn: '', icon: '', isActive: true, sortOrder: 0 });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <CrudFormPage title={t('resources.resources.amenities.singular')} queryKey="amenities" apiFn={amenitiesApi} formData={form} setFormData={setForm} backPath="/amenities" transformSubmit={(d) => ({ ...d, sortOrder: parseInt(d.sortOrder) || 0 })}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={set('nameAr')} required />
        <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={set('nameEn')} required />
      </div>
      <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
    </CrudFormPage>
  );
}
