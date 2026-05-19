import { useState } from 'react';
import CrudListPage from '../../components/common/CrudListPage';
import CrudFormPage from '../../components/common/CrudFormPage';
import { facilitiesApi } from '../../api/crud';
import { TextInput, CheckboxInput } from '../../components/forms/FormField';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function FacilitiesListPage() {
  const { t } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.nameAr') },
    { key: 'nameEn', label: t('resources.fields.nameEn') },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return <CrudListPage title={t('resources.resources.facilities.plural')} queryKey="facilities" apiFn={facilitiesApi} columns={columns} createPath="/facilities/create" createLabel={t('resources.resources.facilities.create')} />;
}

export function FacilityFormPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ nameAr: '', nameEn: '', icon: '', isActive: true, sortOrder: 0 });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <CrudFormPage title={t('resources.resources.facilities.singular')} queryKey="facilities" apiFn={facilitiesApi} formData={form} setFormData={setForm} backPath="/facilities" transformSubmit={(d) => ({ ...d, sortOrder: parseInt(d.sortOrder) || 0 })}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={set('nameAr')} required />
        <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={set('nameEn')} required />
      </div>
      <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
    </CrudFormPage>
  );
}
