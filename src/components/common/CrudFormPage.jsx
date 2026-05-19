import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { SubmitButton } from '../forms/FormField';
import Loading from './Loading';
import { useI18n } from '../../i18n/I18nProvider';

export default function CrudFormPage({ title, queryKey, apiFn, children, formData, setFormData, backPath, transformSubmit }) {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { t } = useI18n();

  const { data: existing, isLoading } = useQuery({
    queryKey: [queryKey, id],
    queryFn: () => apiFn.getById(id).then((r) => r.data.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing && isEdit) setFormData(existing);
  }, [existing]);

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? apiFn.update(id, data) : apiFn.create(data),
    onSuccess: () => {
      qc.invalidateQueries([queryKey]);
      toast.success(isEdit ? t('common.messages.updated') : t('common.messages.created'));
      navigate(backPath);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.errors.generic')),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = transformSubmit ? transformSubmit(formData) : formData;
    mutation.mutate(submitData);
  };

  if (isEdit && isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? t('common.forms.editTitle', { resource: title }) : t('common.forms.addTitle', { resource: title })}
      </h1>
      <div className="bg-card rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit}>
          {children}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t">
            <SubmitButton loading={mutation.isPending}>{isEdit ? t('common.actions.update') : t('common.actions.create')}</SubmitButton>
            <button type="button" onClick={() => navigate(backPath)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              {t('common.actions.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
