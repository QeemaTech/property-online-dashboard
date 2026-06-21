import { useQuery } from '@tanstack/react-query';
import CrudListPage from '../../components/common/CrudListPage';
import { unitsApi, projectsApi, unitTypesApi, unitCategoriesApi } from '../../api/crud';
import { TextInput, TextArea, SelectInput, CheckboxInput } from '../../components/forms/FormField';
import ImageUpload from '../../components/media/ImageUpload';
import SearchableSelect from '../../components/forms/SearchableSelect';
import { BooleanBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export default function UnitsList() {
  const { t, localizedField, formatCurrency, formatNumber } = useI18n();
  const { data: projects } = useQuery({ queryKey: ['projList'], queryFn: () => projectsApi.getAll({ limit: 200 }).then(r => r.data.data) });
  const { data: unitTypes } = useQuery({ queryKey: ['utList'], queryFn: () => unitTypesApi.getAll({ limit: 200 }).then(r => r.data.data) });
  const { data: unitCategories } = useQuery({ queryKey: ['ucList'], queryFn: () => unitCategoriesApi.getAll({ limit: 200 }).then(r => r.data.data) });
  const columns = [
    { key: 'id', label: '#' },
    { key: 'nameAr', label: t('resources.fields.unit'), render: (r) => localizedField(r) || '-' },
    { key: 'code', label: t('resources.fields.code') },
    { key: 'project', label: t('resources.fields.project'), render: (r) => localizedField(r.project) || '-' },
    { key: 'unitType', label: t('resources.fields.unitType'), render: (r) => localizedField(r.unitType) || '-' },
    { key: 'unitCategory', label: t('resources.fields.unitCategory'), render: (r) => (r.unitCategory ? localizedField(r.unitCategory) : '-') },
    { key: 'price', label: t('resources.fields.price'), render: (r) => r.price ? formatCurrency(r.price) : '-' },
    { key: 'bedrooms', label: t('resources.fields.bedrooms') },
    { key: 'builtArea', label: t('resources.fields.builtArea'), render: (r) => r.builtArea ? `${formatNumber(r.builtArea)} m²` : '-' },
    { key: 'isAvailable', label: t('resources.fields.isAvailable'), render: (r) => <BooleanBadge value={r.isAvailable} /> },
  ];

  const toOpts = (arr, lk = 'name') => (arr || []).map(i => ({ value: i.id.toString(), label: localizedField(i, lk) }));
  const finishingOptions = ['FULLY_FINISHED', 'SEMI_FINISHED', 'CORE_SHELL', 'NOT_FINISHED'].map((value) => ({
    value, label: t(`resources.finishingTypes.${value}`),
  }));

  return (
    <CrudListPage
      title={t('resources.resources.units.plural')}
      queryKey="units"
      apiFn={unitsApi}
      columns={columns}
      searchPlaceholder={t('resources.placeholders.searchByNameOrCode')}
      initialFormData={{ projectId: '', unitTypeId: '', unitCategoryId: '', nameAr: '', nameEn: '', code: '', bedrooms: '', bathrooms: '', builtArea: '', landArea: '', floorNumber: '', price: '', downPaymentPercent: '', installmentYears: '', deliveryDate: '', finishingType: '', mainImage: '', isAvailable: true, isFeatured: false, descriptionAr: '', descriptionEn: '' }}
      transformSubmit={(d) => ({ ...d, projectId: d.projectId, unitTypeId: d.unitTypeId, unitCategoryId: d.unitCategoryId || null, bedrooms: d.bedrooms ? parseInt(d.bedrooms) : null, bathrooms: d.bathrooms ? parseInt(d.bathrooms) : null, builtArea: d.builtArea ? parseFloat(d.builtArea) : null, landArea: d.landArea ? parseFloat(d.landArea) : null, floorNumber: d.floorNumber ? parseInt(d.floorNumber) : null, price: d.price ? parseFloat(d.price) : null, downPaymentPercent: d.downPaymentPercent ? parseFloat(d.downPaymentPercent) : null, installmentYears: d.installmentYears ? parseInt(d.installmentYears) : null, finishingType: d.finishingType || null })}
      formFields={(form, setForm) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect label={t('resources.fields.project')} value={form.projectId} onChange={(v) => setForm({ ...form, projectId: v })} options={toOpts(projects)} placeholder={t('resources.placeholders.selectProject')} searchPlaceholder={t('resources.placeholders.searchProject')} required />
            <SelectInput label={t('resources.fields.unitType')} value={form.unitTypeId} onChange={(e) => setForm({ ...form, unitTypeId: e.target.value })} options={toOpts(unitTypes)} required />
            <SelectInput label={t('resources.fields.unitCategory')} value={form.unitCategoryId} onChange={(e) => setForm({ ...form, unitCategoryId: e.target.value })} options={toOpts(unitCategories)} />
            <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
            <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
            <TextInput label={t('resources.fields.code')} value={form.code || ''} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            <TextInput label={t('resources.fields.bedrooms')} type="number" value={form.bedrooms || ''} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
            <TextInput label={t('resources.fields.bathrooms')} type="number" value={form.bathrooms || ''} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
            <TextInput label={t('resources.fields.builtArea')} type="number" value={form.builtArea || ''} onChange={(e) => setForm({ ...form, builtArea: e.target.value })} />
            <TextInput label={t('resources.fields.floorNumber')} type="number" value={form.floorNumber || ''} onChange={(e) => setForm({ ...form, floorNumber: e.target.value })} />
            <TextInput label={t('resources.fields.price')} type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <TextInput label={t('resources.fields.downPaymentPercent')} type="number" value={form.downPaymentPercent || ''} onChange={(e) => setForm({ ...form, downPaymentPercent: e.target.value })} />
            <TextInput label={t('resources.fields.installmentYears')} type="number" value={form.installmentYears || ''} onChange={(e) => setForm({ ...form, installmentYears: e.target.value })} />
            <TextInput label={t('resources.fields.deliveryDate')} value={form.deliveryDate || ''} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
            <SelectInput label={t('resources.fields.finishingType')} value={form.finishingType || ''} onChange={(e) => setForm({ ...form, finishingType: e.target.value })} options={finishingOptions} />
          </div>
          <TextArea label={t('resources.fields.descriptionAr')} value={form.descriptionAr || ''} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
          <TextArea label={t('resources.fields.descriptionEn')} value={form.descriptionEn || ''} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          <ImageUpload label={t('resources.fields.mainImage')} value={form.mainImage || ''} onChange={(v) => setForm({ ...form, mainImage: v })} uploadType="units" />
          <CheckboxInput label={t('resources.fields.isAvailable')} checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
          <CheckboxInput label={t('resources.fields.isFeatured')} checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
        </>
      )}
    />
  );
}
