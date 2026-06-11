import CrudListPage from '../../components/common/CrudListPage';
import { countriesApi } from '../../api/crud';
import { TextInput, CheckboxInput } from '../../components/forms/FormField';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function CountriesListPage() {
  const { t } = useI18n();
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.nameAr') },
    { key: 'nameEn', label: t('resources.fields.nameEn') },
    { key: 'code', label: t('resources.fields.code') },
    { key: 'phoneCode', label: t('resources.fields.phoneCode') },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
  ];

  return (
    <CrudListPage
      title={t('resources.resources.countries.plural')}
      queryKey="countries"
      apiFn={countriesApi}
      columns={columns}
      initialFormData={{ nameAr: '', nameEn: '', code: '', phoneCode: '', isActive: true, sortOrder: 0 }}
      formFields={(form, setForm) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
            <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
            <TextInput label={t('resources.fields.code')} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            <TextInput label={t('resources.fields.phoneCode')} value={form.phoneCode} onChange={(e) => setForm({ ...form, phoneCode: e.target.value })} required />
            <TextInput label={t('resources.fields.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
          </div>
          <CheckboxInput label={t('common.booleans.active')} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
        </>
      )}
    />
  );
}

export function CountryFormPage() {
  return null;
}
