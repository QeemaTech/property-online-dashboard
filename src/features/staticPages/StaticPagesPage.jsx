import { useState } from 'react';
import CrudListPage from '../../components/common/CrudListPage';
import CrudFormPage from '../../components/common/CrudFormPage';
import { staticPagesApi } from '../../api/crud';
import { TextInput, TextArea, CheckboxInput } from '../../components/forms/FormField';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function StaticPagesListPage() {
  const { t, localizedField } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'titleAr', label: t('resources.fields.titleAr'), render: (r) => localizedField(r, 'title') || '-' },
    { key: 'slug', label: t('resources.fields.slug') },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return <CrudListPage title={t('resources.resources.pages.plural')} queryKey="pages" apiFn={staticPagesApi} columns={columns} createPath="/pages/create" createLabel={t('resources.resources.pages.create')} />;
}

export function StaticPageFormPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ slug: '', titleAr: '', titleEn: '', contentAr: '', contentEn: '', isActive: true });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <CrudFormPage title={t('resources.resources.pages.singular')} queryKey="pages" apiFn={staticPagesApi} formData={form} setFormData={setForm} backPath="/pages">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label={t('resources.fields.slug')} value={form.slug} onChange={set('slug')} required />
        <TextInput label={t('resources.fields.titleAr')} value={form.titleAr} onChange={set('titleAr')} required />
        <TextInput label={t('resources.fields.titleEn')} value={form.titleEn} onChange={set('titleEn')} required />
      </div>
      <TextArea label={t('resources.fields.contentAr')} value={form.contentAr} onChange={set('contentAr')} rows={8} required />
      <TextArea label={t('resources.fields.contentEn')} value={form.contentEn} onChange={set('contentEn')} rows={8} required />
      <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
    </CrudFormPage>
  );
}
