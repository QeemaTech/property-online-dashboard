import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsApi } from '../../api/crud';
import { TextInput, SubmitButton } from '../../components/forms/FormField';
import Loading from '../../components/common/Loading';
import { useI18n } from '../../i18n/I18nProvider';

export default function SettingsPage() {
  const { t } = useI18n();
  const [settings, setSettings] = useState([]);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getAll().then(r => r.data.data),
  });

  useEffect(() => { if (data) setSettings(data); }, [data]);

  const mutation = useMutation({
    mutationFn: (items) => settingsApi.update(items),
    onSuccess: () => { qc.invalidateQueries(['settings']); toast.success(t('resources.settings.saved')); },
    onError: () => toast.error(t('common.errors.generic')),
  });

  const handleChange = (index, value) => {
    const updated = [...settings];
    updated[index] = { ...updated[index], value };
    setSettings(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(settings.map(s => ({ key: s.key, value: s.value, group: s.group })));
  };

  if (isLoading) return <Loading />;

  const groups = [...new Set(settings.map(s => s.group))];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('resources.resources.settings.plural')}</h1>
      <form onSubmit={handleSubmit}>
        {groups.map(group => (
          <div key={group} className="bg-card rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            <h3 className="text-lg font-bold mb-4 capitalize">{t(`resources.settings.groups.${group}`) || group}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.map((s, i) => s.group === group && (
                <TextInput key={s.key} label={s.key} value={s.value} onChange={(e) => handleChange(i, e.target.value)} />
              ))}
            </div>
          </div>
        ))}
        <SubmitButton loading={mutation.isPending}>{t('resources.settings.save')}</SubmitButton>
      </form>
    </div>
  );
}
