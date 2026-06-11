import CrudListPage from '../../components/common/CrudListPage';
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

  return (
    <CrudListPage
      title={t('resources.resources.banners.plural')}
      queryKey="banners"
      apiFn={bannersApi}
      columns={columns}
      initialFormData={{ titleAr: '', titleEn: '', imageUrl: '', linkType: '', linkValue: '', isActive: true, sortOrder: 0 }}
      transformSubmit={(d) => ({ ...d, sortOrder: parseInt(d.sortOrder) || 0 })}
      formFields={(form, setForm) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.titleAr')} value={form.titleAr || ''} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
            <TextInput label={t('resources.fields.titleEn')} value={form.titleEn || ''} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
            <TextInput label={t('resources.fields.linkType')} value={form.linkType || ''} onChange={(e) => setForm({ ...form, linkType: e.target.value })} />
            <TextInput label={t('resources.fields.linkValue')} value={form.linkValue || ''} onChange={(e) => setForm({ ...form, linkValue: e.target.value })} />
            <TextInput label={t('resources.fields.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
          </div>
          <ImageUpload label={t('resources.fields.imageUrl')} value={form.imageUrl || ''} onChange={(v) => setForm({ ...form, imageUrl: v })} />
          <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
        </>
      )}
    />
  );
}

export function BannerFormPage() {
  return null;
}
