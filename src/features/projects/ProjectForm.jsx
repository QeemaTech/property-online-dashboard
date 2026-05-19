import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { projectsApi, developersApi, categoriesApi, countriesApi, citiesApi, areasApi, amenitiesApi, facilitiesApi } from '../../api/crud';
import { TextInput, TextArea, SelectInput, CheckboxInput, SubmitButton } from '../../components/forms/FormField';
import ImageUpload from '../../components/media/ImageUpload';
import Loading from '../../components/common/Loading';
import SearchableSelect from '../../components/forms/SearchableSelect';
import { useI18n } from '../../i18n/I18nProvider';

export default function ProjectForm() {
  const { t, localizedField } = useI18n();
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    nameAr: '', nameEn: '', developerId: '', categoryId: '', countryId: '', cityId: '', areaId: '',
    shortDescriptionAr: '', shortDescriptionEn: '', descriptionAr: '', descriptionEn: '',
    addressAr: '', addressEn: '', latitude: '', longitude: '',
    startingPrice: '', maxPrice: '', downPaymentPercent: '', installmentYears: '', deliveryYear: '',
    status: 'DRAFT', isFeatured: false, isRecommended: false, isLatest: false,
    mainImage: '', coverImage: '', callPhone: '', whatsappNumber: '',
    amenityIds: [], facilityIds: [],
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e?.target ? e.target.value : e });
  const setBool = (key) => (e) => setForm({ ...form, [key]: e.target.checked });

  const { data: developers } = useQuery({ queryKey: ['devList'], queryFn: () => developersApi.getAll({ limit: 100 }).then(r => r.data.data) });
  const { data: categories } = useQuery({ queryKey: ['catList'], queryFn: () => categoriesApi.getAll({ limit: 100 }).then(r => r.data.data) });
  const { data: countries } = useQuery({ queryKey: ['countryList'], queryFn: () => countriesApi.getAll({ limit: 100 }).then(r => r.data.data) });
  const { data: cities } = useQuery({ queryKey: ['cityList', form.countryId], queryFn: () => citiesApi.getAll({ countryId: form.countryId, limit: 100 }).then(r => r.data.data), enabled: !!form.countryId });
  const { data: allAreas } = useQuery({ queryKey: ['areaList', form.cityId], queryFn: () => areasApi.getAll({ cityId: form.cityId, limit: 100 }).then(r => r.data.data), enabled: !!form.cityId });
  const { data: amenities } = useQuery({ queryKey: ['amenList'], queryFn: () => amenitiesApi.getAll({ limit: 100 }).then(r => r.data.data) });
  const { data: facilities } = useQuery({ queryKey: ['facList'], queryFn: () => facilitiesApi.getAll({ limit: 100 }).then(r => r.data.data) });

  const { data: existing, isLoading } = useQuery({ queryKey: ['project', id], queryFn: () => projectsApi.getById(id).then(r => r.data.data), enabled: isEdit });

  useEffect(() => {
    if (existing && isEdit) {
      setForm({
        ...existing,
        developerId: existing.developerId?.toString() || '',
        categoryId: existing.categoryId?.toString() || '',
        countryId: existing.countryId?.toString() || '',
        cityId: existing.cityId?.toString() || '',
        areaId: existing.areaId?.toString() || '',
        amenityIds: existing.amenities?.map(a => a.amenityId) || [],
        facilityIds: existing.facilities?.map(f => f.facilityId) || [],
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? projectsApi.update(id, data) : projectsApi.create(data),
    onSuccess: () => { qc.invalidateQueries(['projects']); toast.success(isEdit ? t('common.messages.updated') : t('common.messages.created')); navigate('/projects'); },
    onError: (err) => toast.error(err.response?.data?.message || t('common.errors.generic')),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      developerId: form.developerId,
      categoryId: form.categoryId,
      countryId: form.countryId,
      cityId: form.cityId,
      areaId: form.areaId ? form.areaId : null,
      startingPrice: form.startingPrice ? parseFloat(form.startingPrice) : null,
      maxPrice: form.maxPrice ? parseFloat(form.maxPrice) : null,
      downPaymentPercent: form.downPaymentPercent ? parseFloat(form.downPaymentPercent) : null,
      installmentYears: form.installmentYears ? parseInt(form.installmentYears) : null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
    };
    mutation.mutate(data);
  };

  if (isEdit && isLoading) return <Loading />;

  const toOpts = (arr, labelKey = 'name') => (arr || []).map(i => ({ value: i.id.toString(), label: localizedField(i, labelKey) }));
  const statusOptions = ['DRAFT', 'ACTIVE', 'SOLD_OUT', 'COMING_SOON'].map((value) => ({
    value,
    label: t(`common.statuses.${value}`),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEdit
          ? t('common.forms.editTitle', { resource: t('resources.resources.projects.singular') })
          : t('common.forms.addTitle', { resource: t('resources.resources.projects.singular') })}
      </h1>
      <div className="bg-card rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.nameAr')} value={form.nameAr} onChange={set('nameAr')} required />
            <TextInput label={t('resources.fields.nameEn')} value={form.nameEn} onChange={set('nameEn')} required />
            <SearchableSelect
              label={t('resources.fields.developer')}
              value={form.developerId}
              onChange={(v) => setForm({ ...form, developerId: v })}
              options={toOpts(developers)}
              placeholder={t('resources.placeholders.selectDeveloper')}
              searchPlaceholder={t('resources.placeholders.searchDeveloper')}
              required
            />
            <SelectInput label={t('resources.fields.category')} value={form.categoryId} onChange={set('categoryId')} options={toOpts(categories)} required />
            <SelectInput label={t('resources.fields.country')} value={form.countryId} onChange={set('countryId')} options={toOpts(countries)} required />
            <SelectInput label={t('resources.fields.city')} value={form.cityId} onChange={set('cityId')} options={toOpts(cities)} required />
            <SelectInput label={t('resources.fields.area')} value={form.areaId} onChange={set('areaId')} options={toOpts(allAreas)} />
            <SelectInput label={t('resources.fields.status')} value={form.status} onChange={set('status')} options={statusOptions} />
            <TextInput label={t('resources.fields.startingPrice')} type="number" value={form.startingPrice || ''} onChange={set('startingPrice')} />
            <TextInput label={t('resources.fields.maxPrice')} type="number" value={form.maxPrice || ''} onChange={set('maxPrice')} />
            <TextInput label={t('resources.fields.downPaymentPercent')} type="number" value={form.downPaymentPercent || ''} onChange={set('downPaymentPercent')} />
            <TextInput label={t('resources.fields.installmentYears')} type="number" value={form.installmentYears || ''} onChange={set('installmentYears')} />
            <TextInput label={t('resources.fields.deliveryYear')} value={form.deliveryYear || ''} onChange={set('deliveryYear')} />
            <TextInput label={t('resources.fields.callPhone')} value={form.callPhone || ''} onChange={set('callPhone')} />
            <TextInput label={t('resources.fields.whatsappNumber')} value={form.whatsappNumber || ''} onChange={set('whatsappNumber')} />
          </div>
          <TextArea label={t('resources.fields.shortDescriptionAr')} value={form.shortDescriptionAr || ''} onChange={set('shortDescriptionAr')} />
          <TextArea label={t('resources.fields.shortDescriptionEn')} value={form.shortDescriptionEn || ''} onChange={set('shortDescriptionEn')} />
          <TextArea label={t('resources.fields.descriptionAr')} value={form.descriptionAr || ''} onChange={set('descriptionAr')} />
          <TextArea label={t('resources.fields.descriptionEn')} value={form.descriptionEn || ''} onChange={set('descriptionEn')} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.addressAr')} value={form.addressAr || ''} onChange={set('addressAr')} />
            <TextInput label={t('resources.fields.addressEn')} value={form.addressEn || ''} onChange={set('addressEn')} />
            <TextInput label={t('resources.fields.latitude')} type="number" step="any" value={form.latitude || ''} onChange={set('latitude')} />
            <TextInput label={t('resources.fields.longitude')} type="number" step="any" value={form.longitude || ''} onChange={set('longitude')} />
          </div>

          <div className="flex gap-6 my-4">
            <ImageUpload label={t('resources.fields.mainImage')} value={form.mainImage || ''} onChange={(v) => setForm({ ...form, mainImage: v })} />
            <ImageUpload label={t('resources.fields.coverImage')} value={form.coverImage || ''} onChange={(v) => setForm({ ...form, coverImage: v })} />
          </div>

          {amenities?.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('resources.fields.amenities')}</label>
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <label key={a.id} className="flex items-center gap-1 text-sm bg-gray-50 px-3 py-1.5 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={form.amenityIds.includes(a.id)} onChange={(e) => {
                      setForm({ ...form, amenityIds: e.target.checked ? [...form.amenityIds, a.id] : form.amenityIds.filter(x => x !== a.id) });
                    }} className="w-3.5 h-3.5" />
                    {localizedField(a)}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 my-4">
            <CheckboxInput label={t('resources.fields.isFeatured')} checked={form.isFeatured} onChange={setBool('isFeatured')} />
            <CheckboxInput label={t('resources.fields.isRecommended')} checked={form.isRecommended} onChange={setBool('isRecommended')} />
            <CheckboxInput label={t('resources.fields.isLatest')} checked={form.isLatest} onChange={setBool('isLatest')} />
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t">
            <SubmitButton loading={mutation.isPending}>{isEdit ? t('common.actions.update') : t('common.actions.create')}</SubmitButton>
            <button type="button" onClick={() => navigate('/projects')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">{t('common.actions.cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
