import CrudListPage from '../../components/common/CrudListPage';
import { onboardingApi } from '../../api/crud';
import { TextInput, TextArea, CheckboxInput } from '../../components/forms/FormField';
import ImageUpload from '../../components/media/ImageUpload';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function OnboardingListPage() {
  const { t, localizedField } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'titleAr', label: t('resources.fields.titleAr'), render: (r) => localizedField(r, 'title') || '-' },
    { key: 'titleEn', label: t('resources.fields.titleEn') },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
    { key: 'sortOrder', label: t('resources.fields.sortOrder') },
  ];

  return (
    <CrudListPage
      title={t('resources.resources.onboarding.plural')}
      queryKey="onboarding"
      apiFn={onboardingApi}
      columns={columns}
      initialFormData={{ titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', imageUrl: '', isActive: true, sortOrder: 0 }}
      transformSubmit={(d) => ({ ...d, sortOrder: parseInt(d.sortOrder) || 0 })}
      formFields={(form, setForm) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.titleAr')} value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} required />
            <TextInput label={t('resources.fields.titleEn')} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required />
          </div>
          <TextArea label={t('resources.fields.descriptionAr')} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} required />
          <TextArea label={t('resources.fields.descriptionEn')} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} required />
          <ImageUpload label={t('resources.fields.imageUrl')} value={form.imageUrl || ''} onChange={(v) => setForm({ ...form, imageUrl: v })} />
          <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
        </>
      )}
    />
  );
}

export function OnboardingFormPage() {
  return null;
}
