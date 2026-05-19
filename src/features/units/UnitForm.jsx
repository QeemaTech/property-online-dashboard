import { useState } from 'react';
import CrudFormPage from '../../components/common/CrudFormPage';
import { unitsApi, projectsApi } from '../../api/crud';
import { TextInput, TextArea, SelectInput, CheckboxInput } from '../../components/forms/FormField';
import { useQuery } from '@tanstack/react-query';
import ImageUpload from '../../components/media/ImageUpload';
import SearchableSelect from '../../components/forms/SearchableSelect';
import { unitTypesApi } from '../../api/crud';
import { useI18n } from '../../i18n/I18nProvider';

export default function UnitForm() {
  const { t, localizedField } = useI18n();
  const [form, setForm] = useState({
    projectId: '', unitTypeId: '', nameAr: '', nameEn: '', code: '',
    bedrooms: '', bathrooms: '', builtArea: '', landArea: '', floorNumber: '',
    price: '', downPaymentPercent: '', installmentYears: '', deliveryDate: '',
    finishingType: '', viewType: '', mainImage: '', isAvailable: true, isFeatured: false,
    descriptionAr: '', descriptionEn: '',
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e?.target ? e.target.value : e });
  const setBool = (key) => (e) => setForm({ ...form, [key]: e.target.checked });

  const { data: projects } = useQuery({ queryKey: ['projList'], queryFn: () => projectsApi.getAll({ limit: 200 }).then(r => r.data.data) });

  const { data: unitTypes } = useQuery({ queryKey: ['utList'], queryFn: () => unitTypesApi.getAll({ limit: 200 }).then(r => r.data.data) });

  const transform = (d) => ({
    ...d,
    projectId: d.projectId, unitTypeId: d.unitTypeId,
    bedrooms: d.bedrooms ? parseInt(d.bedrooms) : null, bathrooms: d.bathrooms ? parseInt(d.bathrooms) : null,
    builtArea: d.builtArea ? parseFloat(d.builtArea) : null, landArea: d.landArea ? parseFloat(d.landArea) : null,
    floorNumber: d.floorNumber ? parseInt(d.floorNumber) : null, price: d.price ? parseFloat(d.price) : null,
    downPaymentPercent: d.downPaymentPercent ? parseFloat(d.downPaymentPercent) : null,
    installmentYears: d.installmentYears ? parseInt(d.installmentYears) : null,
    finishingType: d.finishingType || null,
  });

  const toOpts = (arr, lk = 'name') => (arr || []).map(i => ({ value: i.id.toString(), label: localizedField(i, lk) }));
  const finishingOptions = ['FULLY_FINISHED', 'SEMI_FINISHED', 'CORE_SHELL', 'NOT_FINISHED'].map((value) => ({
    value,
    label: t(`resources.finishingTypes.${value}`),
  }));

  return (
    <CrudFormPage title={t('resources.resources.units.singular')} queryKey="units" apiFn={unitsApi} formData={form} setFormData={(d) => setForm({ ...d, projectId: d.projectId?.toString() || '', unitTypeId: d.unitTypeId?.toString() || '' })} backPath="/units" transformSubmit={transform}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchableSelect
          label={t('resources.fields.project')}
          value={form.projectId}
          onChange={(v) => setForm({ ...form, projectId: v })}
          options={toOpts(projects)}
          placeholder={t('resources.placeholders.selectProject')}
          searchPlaceholder={t('resources.placeholders.searchProject')}
          required
        />
        <SelectInput label={t('resources.fields.unitType')} value={form.unitTypeId} onChange={set('unitTypeId')} options={toOpts(unitTypes)} required />
        <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={set('nameAr')} required />
        <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={set('nameEn')} required />
        <TextInput label={t('resources.fields.code')} value={form.code || ''} onChange={set('code')} />
        <TextInput label={t('resources.fields.bedrooms')} type="number" value={form.bedrooms || ''} onChange={set('bedrooms')} />
        <TextInput label={t('resources.fields.bathrooms')} type="number" value={form.bathrooms || ''} onChange={set('bathrooms')} />
        <TextInput label={t('resources.fields.builtArea')} type="number" value={form.builtArea || ''} onChange={set('builtArea')} />
        <TextInput label={t('resources.fields.floorNumber')} type="number" value={form.floorNumber || ''} onChange={set('floorNumber')} />
        <TextInput label={t('resources.fields.price')} type="number" value={form.price || ''} onChange={set('price')} />
        <TextInput label={t('resources.fields.downPaymentPercent')} type="number" value={form.downPaymentPercent || ''} onChange={set('downPaymentPercent')} />
        <TextInput label={t('resources.fields.installmentYears')} type="number" value={form.installmentYears || ''} onChange={set('installmentYears')} />
        <TextInput label={t('resources.fields.deliveryDate')} value={form.deliveryDate || ''} onChange={set('deliveryDate')} />
        <SelectInput label={t('resources.fields.finishingType')} value={form.finishingType || ''} onChange={set('finishingType')} options={finishingOptions} />
      </div>
      <TextArea label={t('resources.fields.descriptionAr')} value={form.descriptionAr || ''} onChange={set('descriptionAr')} />
      <TextArea label={t('resources.fields.descriptionEn')} value={form.descriptionEn || ''} onChange={set('descriptionEn')} />
      <ImageUpload label={t('resources.fields.mainImage')} value={form.mainImage || ''} onChange={(v) => setForm({ ...form, mainImage: v })} />
      <CheckboxInput label={t('resources.fields.isAvailable')} checked={form.isAvailable} onChange={setBool('isAvailable')} />
      <CheckboxInput label={t('resources.fields.isFeatured')} checked={form.isFeatured} onChange={setBool('isFeatured')} />
    </CrudFormPage>
  );
}
