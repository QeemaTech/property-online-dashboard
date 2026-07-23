import { useQuery } from '@tanstack/react-query';
import CrudListPage from '../../components/common/CrudListPage';
import { offersApi, projectsApi, unitsApi } from '../../api/crud';
import { TextInput, TextArea, SelectInput, CheckboxInput } from '../../components/forms/FormField';
import ImageUpload from '../../components/media/ImageUpload';
import { ActiveBadge } from '../../components/common/Badge';
import { useI18n } from '../../i18n/I18nProvider';

export function OffersListPage() {
  const { t, localizedField } = useI18n();
  const { data: projects } = useQuery({
    queryKey: ['projList'],
    queryFn: () => projectsApi.getAll({ limit: 200 }).then((r) => r.data.data),
  });
  const { data: units } = useQuery({
    queryKey: ['unitList'],
    queryFn: () => unitsApi.getAll({ limit: 200 }).then((r) => r.data.data),
  });

  const toOpts = (arr) => (arr || []).map((item) => ({
    value: item.id.toString(),
    label: localizedField(item) || item.nameEn || item.id,
  }));

  const linkTypeOptions = [
    { value: 'UNIT', label: t('resources.fields.unit') },
    { value: 'PROJECT', label: t('resources.fields.project') },
  ];

  const columns = [
    { key: 'id', label: '#' },
    { key: 'titleAr', label: t('resources.fields.titleAr'), render: (r) => localizedField(r, 'title') || '-' },
    {
      key: 'imageUrl',
      label: t('resources.fields.imageUrl'),
      render: (r) => (r.imageUrl
        ? <img src={r.imageUrl.startsWith('http') ? r.imageUrl : `/${r.imageUrl}`} alt="" className="w-16 h-10 object-cover rounded" />
        : '-'),
    },
    { key: 'linkType', label: t('resources.fields.linkType') },
    {
      key: 'target',
      label: t('resources.fields.linkValue'),
      render: (r) => {
        if (r.linkType === 'UNIT') return localizedField(r.unit) || r.unitId || '-';
        return localizedField(r.project) || r.projectId || '-';
      },
    },
    { key: 'isActive', label: t('resources.fields.isActive'), render: (r) => <ActiveBadge value={r.isActive} /> },
    { key: 'sortOrder', label: t('resources.fields.sortOrder') },
  ];

  return (
    <CrudListPage
      title={t('resources.resources.offers.plural')}
      queryKey="offers"
      apiFn={offersApi}
      columns={columns}
      initialFormData={{
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        imageUrl: '',
        linkType: 'UNIT',
        unitId: '',
        projectId: '',
        isActive: true,
        sortOrder: 0,
        startDate: '',
        endDate: '',
      }}
      transformSubmit={(d) => ({
        titleAr: d.titleAr,
        titleEn: d.titleEn,
        descriptionAr: d.descriptionAr || null,
        descriptionEn: d.descriptionEn || null,
        imageUrl: d.imageUrl,
        linkType: d.linkType,
        unitId: d.linkType === 'UNIT' ? d.unitId || null : null,
        projectId: d.linkType === 'PROJECT' ? d.projectId || null : null,
        isActive: d.isActive,
        sortOrder: parseInt(d.sortOrder, 10) || 0,
        startDate: d.startDate || null,
        endDate: d.endDate || null,
      })}
      formFields={(form, setForm) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('resources.fields.titleAr')} value={form.titleAr || ''} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} required />
            <TextInput label={t('resources.fields.titleEn')} value={form.titleEn || ''} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required />
          </div>
          <TextArea label={t('resources.fields.descriptionAr')} value={form.descriptionAr || ''} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
          <TextArea label={t('resources.fields.descriptionEn')} value={form.descriptionEn || ''} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label={t('resources.fields.linkType')}
              value={form.linkType || 'UNIT'}
              onChange={(e) => setForm({
                ...form,
                linkType: e.target.value,
                unitId: e.target.value === 'UNIT' ? form.unitId : '',
                projectId: e.target.value === 'PROJECT' ? form.projectId : '',
              })}
              options={linkTypeOptions}
              required
            />
            <TextInput
              label={t('resources.fields.sortOrder')}
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })}
            />
            {form.linkType === 'PROJECT' ? (
              <SelectInput
                label={t('resources.fields.project')}
                value={form.projectId || ''}
                onChange={(e) => setForm({ ...form, projectId: e.target.value, unitId: '' })}
                options={toOpts(projects)}
                required
              />
            ) : (
              <SelectInput
                label={t('resources.fields.unit')}
                value={form.unitId || ''}
                onChange={(e) => setForm({ ...form, unitId: e.target.value, projectId: '' })}
                options={toOpts(units)}
                required
              />
            )}
            <TextInput
              label={t('resources.fields.startDate')}
              type="datetime-local"
              value={form.startDate ? String(form.startDate).slice(0, 16) : ''}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <TextInput
              label={t('resources.fields.endDate')}
              type="datetime-local"
              value={form.endDate ? String(form.endDate).slice(0, 16) : ''}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
          <ImageUpload
            label={t('resources.fields.imageUrl')}
            value={form.imageUrl || ''}
            onChange={(v) => setForm({ ...form, imageUrl: v })}
            uploadType="offers"
          />
          <CheckboxInput
            label={t('common.booleans.active')}
            checked={!!form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
        </>
      )}
    />
  );
}
