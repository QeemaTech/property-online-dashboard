import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CrudFormPage from '../../components/common/CrudFormPage';
import { developersApi } from '../../api/crud';
import { TextInput, TextArea, CheckboxInput } from '../../components/forms/FormField';
import ImageUpload from '../../components/media/ImageUpload';
import GalleryUpload from '../../components/media/GalleryUpload';
import { useI18n } from '../../i18n/I18nProvider';

const initial = { nameAr: '', nameEn: '', shortDescriptionAr: '', shortDescriptionEn: '', fullDescriptionAr: '', fullDescriptionEn: '', phone: '', whatsapp: '', website: '', email: '', yearsOfExperience: '', numberOfProjects: '', logo: '', coverImage: '', isFeatured: false, isActive: true };

export default function DeveloperForm() {
  const { t } = useI18n();
  const { id } = useParams();
  const [form, setForm] = useState(initial);
  const set = (key) => (e) => setForm({ ...form, [key]: e?.target ? e.target.value : e });
  const setBool = (key) => (e) => setForm({ ...form, [key]: e.target.checked });

  const transform = (data) => ({
    ...data,
    yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : null,
    numberOfProjects: data.numberOfProjects ? parseInt(data.numberOfProjects) : null,
  });

  return (
    <CrudFormPage title={t('resources.resources.developers.singular')} queryKey="developers" apiFn={developersApi} formData={form} setFormData={setForm} backPath="/developers" transformSubmit={transform}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={set('nameAr')} required />
        <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={set('nameEn')} required />
        <TextInput label={t('resources.fields.phone')} value={form.phone || ''} onChange={set('phone')} />
        <TextInput label={t('resources.fields.whatsapp')} value={form.whatsapp || ''} onChange={set('whatsapp')} />
        <TextInput label={t('resources.fields.website')} value={form.website || ''} onChange={set('website')} />
        <TextInput label={t('resources.fields.email')} value={form.email || ''} onChange={set('email')} />
        <TextInput label={t('resources.fields.yearsOfExperience')} type="number" value={form.yearsOfExperience || ''} onChange={set('yearsOfExperience')} />
        <TextInput label={t('resources.fields.numberOfProjects')} type="number" value={form.numberOfProjects || ''} onChange={set('numberOfProjects')} />
      </div>
      <TextArea label={t('resources.fields.shortDescriptionAr')} value={form.shortDescriptionAr || ''} onChange={set('shortDescriptionAr')} />
      <TextArea label={t('resources.fields.shortDescriptionEn')} value={form.shortDescriptionEn || ''} onChange={set('shortDescriptionEn')} />
      <TextArea label={t('resources.fields.fullDescriptionAr')} value={form.fullDescriptionAr || ''} onChange={set('fullDescriptionAr')} />
      <TextArea label={t('resources.fields.fullDescriptionEn')} value={form.fullDescriptionEn || ''} onChange={set('fullDescriptionEn')} />
      <div className="flex gap-6">
        <ImageUpload label={t('resources.fields.logo')} value={form.logo || ''} onChange={(v) => setForm({ ...form, logo: v })} uploadType="developers" />
        <ImageUpload label={t('resources.fields.coverImage')} value={form.coverImage || ''} onChange={(v) => setForm({ ...form, coverImage: v })} uploadType="developers" />
      </div>
      {id && (
        <GalleryUpload
          entityId={id}
          galleries={form.galleries || []}
          onUpload={async (entityId, formData) => {
            const res = await developersApi.addGallery(entityId, formData);
            setForm((prev) => ({ ...prev, galleries: [...(prev.galleries || []), res.data.data] }));
          }}
          onRemove={async (galleryId) => {
            await developersApi.removeGallery(galleryId);
            setForm((prev) => ({ ...prev, galleries: (prev.galleries || []).filter((g) => g.id !== galleryId) }));
          }}
        />
      )}
      <CheckboxInput label={t('resources.fields.isFeatured')} checked={form.isFeatured} onChange={setBool('isFeatured')} />
      <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={setBool('isActive')} />
    </CrudFormPage>
  );
}
