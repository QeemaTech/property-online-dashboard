import CrudListPage from '../../components/common/CrudListPage';
import { developersApi } from '../../api/crud';
import { TextInput, TextArea, CheckboxInput } from '../../components/forms/FormField';
import ImageUpload from '../../components/media/ImageUpload';
import GalleryUpload from '../../components/media/GalleryUpload';
import { ActiveBadge, BooleanBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export default function DevelopersList() {
  const { t } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.nameAr') },
    { key: 'nameEn', label: t('resources.fields.nameEn') },
    { key: 'numberOfProjects', label: t('resources.resources.projects.plural'), render: (r) => r.numberOfProjects || r._count?.projects || 0 },
    { key: 'isFeatured', label: t('resources.fields.isFeatured'), render: (r) => <BooleanBadge value={r.isFeatured} falseVariant="default" /> },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return (
    <CrudListPage
      title={t('resources.resources.developers.plural')}
      queryKey="developers"
      apiFn={developersApi}
      columns={columns}
      searchPlaceholder={t('resources.placeholders.searchByName')}
      initialFormData={{ nameAr: '', nameEn: '', shortDescriptionAr: '', shortDescriptionEn: '', fullDescriptionAr: '', fullDescriptionEn: '', phone: '', whatsapp: '', website: '', email: '', yearsOfExperience: '', numberOfProjects: '', logo: '', coverImage: '', isFeatured: false, isActive: true }}
      transformSubmit={(d) => ({ ...d, yearsOfExperience: d.yearsOfExperience ? parseInt(d.yearsOfExperience) : null, numberOfProjects: d.numberOfProjects ? parseInt(d.numberOfProjects) : null })}
      formFields={(form, setForm, isFormEdit) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
            <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
            <TextInput label={t('resources.fields.phone')} value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <TextInput label={t('resources.fields.whatsapp')} value={form.whatsapp || ''} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            <TextInput label={t('resources.fields.website')} value={form.website || ''} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            <TextInput label={t('resources.fields.email')} value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextInput label={t('resources.fields.yearsOfExperience')} type="number" value={form.yearsOfExperience || ''} onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })} />
            <TextInput label={t('resources.fields.numberOfProjects')} type="number" value={form.numberOfProjects || ''} onChange={(e) => setForm({ ...form, numberOfProjects: e.target.value })} />
          </div>
          <TextArea label={t('resources.fields.shortDescriptionAr')} value={form.shortDescriptionAr || ''} onChange={(e) => setForm({ ...form, shortDescriptionAr: e.target.value })} />
          <TextArea label={t('resources.fields.shortDescriptionEn')} value={form.shortDescriptionEn || ''} onChange={(e) => setForm({ ...form, shortDescriptionEn: e.target.value })} />
          <TextArea label={t('resources.fields.fullDescriptionAr')} value={form.fullDescriptionAr || ''} onChange={(e) => setForm({ ...form, fullDescriptionAr: e.target.value })} />
          <TextArea label={t('resources.fields.fullDescriptionEn')} value={form.fullDescriptionEn || ''} onChange={(e) => setForm({ ...form, fullDescriptionEn: e.target.value })} />
          <div className="flex gap-6">
            <ImageUpload label={t('resources.fields.logo')} value={form.logo || ''} onChange={(v) => setForm({ ...form, logo: v })} uploadType="developers" />
            <ImageUpload label={t('resources.fields.coverImage')} value={form.coverImage || ''} onChange={(v) => setForm({ ...form, coverImage: v })} uploadType="developers" />
          </div>
          {isFormEdit && (
            <GalleryUpload
              entityId={form.id}
              galleries={form.galleries || []}
              onUpload={async (id, formData) => {
                const res = await developersApi.addGallery(id, formData);
                setForm((prev) => ({ ...prev, galleries: [...(prev.galleries || []), res.data.data] }));
              }}
              onRemove={async (galleryId) => {
                await developersApi.removeGallery(galleryId);
                setForm((prev) => ({ ...prev, galleries: (prev.galleries || []).filter((g) => g.id !== galleryId) }));
              }}
            />
          )}
          <CheckboxInput label={t('resources.fields.isFeatured')} checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
        </>
      )}
    />
  );
}
