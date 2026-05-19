import { useState } from 'react';
import CrudListPage from '../../components/common/CrudListPage';
import CrudFormPage from '../../components/common/CrudFormPage';
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

  return <CrudListPage title={t('resources.resources.onboarding.plural')} queryKey="onboarding" apiFn={onboardingApi} columns={columns} createPath="/onboarding/create" createLabel={t('resources.resources.onboarding.create')} />;
}

export function OnboardingFormPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', imageUrl: '', isActive: true, sortOrder: 0 });
  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });
  return (
    <CrudFormPage title={t('resources.resources.onboarding.singular')} queryKey="onboarding" apiFn={onboardingApi} formData={form} setFormData={setForm} backPath="/onboarding" transformSubmit={(d) => ({ ...d, sortOrder: parseInt(d.sortOrder) || 0 })}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label={t('resources.fields.titleAr')} value={form.titleAr} onChange={set('titleAr')} required />
        <TextInput label={t('resources.fields.titleEn')} value={form.titleEn} onChange={set('titleEn')} required />
      </div>
      <TextArea label={t('resources.fields.descriptionAr')} value={form.descriptionAr} onChange={set('descriptionAr')} required />
      <TextArea label={t('resources.fields.descriptionEn')} value={form.descriptionEn} onChange={set('descriptionEn')} required />
      <ImageUpload label={t('resources.fields.imageUrl')} value={form.imageUrl || ''} onChange={(v) => setForm({ ...form, imageUrl: v })} />
      <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
    </CrudFormPage>
  );
}
