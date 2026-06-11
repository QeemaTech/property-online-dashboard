import CrudListPage from '../../components/common/CrudListPage';
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

  return (
    <CrudListPage
      title={t('resources.resources.pages.plural')}
      queryKey="pages"
      apiFn={staticPagesApi}
      columns={columns}
      initialFormData={{ slug: '', titleAr: '', titleEn: '', contentAr: '', contentEn: '', isActive: true }}
      formFields={(form, setForm) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.slug')} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            <TextInput label={t('resources.fields.titleAr')} value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} required />
            <TextInput label={t('resources.fields.titleEn')} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required />
          </div>
          <TextArea label={t('resources.fields.contentAr')} value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} rows={8} required />
          <TextArea label={t('resources.fields.contentEn')} value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} rows={8} required />
          <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
        </>
      )}
    />
  );
}

export function StaticPageFormPage() {
  return null;
}
