import { useState } from 'react';
import CrudListPage from '../../components/common/CrudListPage';
import CrudFormPage from '../../components/common/CrudFormPage';
import { categoriesApi } from '../../api/crud';
import { TextInput, CheckboxInput } from '../../components/forms/FormField';
import ImageUpload from '../../components/media/ImageUpload';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function CategoriesListPage() {
  const { t } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.nameAr') },
    { key: 'nameEn', label: t('resources.fields.nameEn') },
    { key: 'slug', label: t('resources.fields.slug') },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return <CrudListPage title={t('resources.resources.categories.plural')} queryKey="categories" apiFn={categoriesApi} columns={columns} createPath="/categories/create" createLabel={t('resources.resources.categories.create')} />;
}

export function CategoryFormPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ nameAr: '', nameEn: '', icon: '', image: '', description: '', isActive: true, sortOrder: 0 });
  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });
  return (
    <CrudFormPage title={t('resources.resources.categories.singular')} queryKey="categories" apiFn={categoriesApi} formData={form} setFormData={setForm} backPath="/categories" transformSubmit={(d) => ({ ...d, sortOrder: parseInt(d.sortOrder) || 0 })}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={set('nameAr')} required />
        <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={set('nameEn')} required />
        <TextInput label={t('resources.fields.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
      </div>
      <ImageUpload label={t('resources.fields.image')} value={form.image || ''} onChange={(v) => setForm({ ...form, image: v })} />
      <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
    </CrudFormPage>
  );
}
