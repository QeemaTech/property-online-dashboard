import { useState } from 'react';
import CrudListPage from '../../components/common/CrudListPage';
import CrudFormPage from '../../components/common/CrudFormPage';
import { bannersApi } from '../../api/crud';
import { TextInput, CheckboxInput } from '../../components/forms/FormField';
import ImageUpload from '../../components/media/ImageUpload';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function BannersListPage() {
  const { t, localizedField } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'titleAr', label: t('resources.fields.titleAr'), render: (r) => localizedField(r, 'title') || '-' },
    { key: 'imageUrl', label: t('resources.fields.imageUrl'), render: (r) => r.imageUrl ? <img src={r.imageUrl.startsWith('http') ? r.imageUrl : `/${r.imageUrl}`} className="w-16 h-10 object-cover rounded" /> : '-' },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
    { key: 'sortOrder', label: t('resources.fields.sortOrder') },
  ];

  return <CrudListPage title={t('resources.resources.banners.plural')} queryKey="banners" apiFn={bannersApi} columns={columns} createPath="/banners/create" createLabel={t('resources.resources.banners.create')} />;
}

export function BannerFormPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ titleAr: '', titleEn: '', imageUrl: '', linkType: '', linkValue: '', isActive: true, sortOrder: 0 });
  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });
  return (
    <CrudFormPage title={t('resources.resources.banners.singular')} queryKey="banners" apiFn={bannersApi} formData={form} setFormData={setForm} backPath="/banners" transformSubmit={(d) => ({ ...d, sortOrder: parseInt(d.sortOrder) || 0 })}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label={t('resources.fields.titleAr')} value={form.titleAr || ''} onChange={set('titleAr')} />
        <TextInput label={t('resources.fields.titleEn')} value={form.titleEn || ''} onChange={set('titleEn')} />
        <TextInput label={t('resources.fields.linkType')} value={form.linkType || ''} onChange={set('linkType')} />
        <TextInput label={t('resources.fields.linkValue')} value={form.linkValue || ''} onChange={set('linkValue')} />
        <TextInput label={t('resources.fields.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
      </div>
      <ImageUpload label={t('resources.fields.imageUrl')} value={form.imageUrl || ''} onChange={(v) => setForm({ ...form, imageUrl: v })} />
      <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
    </CrudFormPage>
  );
}
