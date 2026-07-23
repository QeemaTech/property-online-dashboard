import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { appScreensApi } from '../../api/crud';
import { TextArea, TextInput, SubmitButton } from '../../components/forms/FormField';
import ImageUpload from '../../components/media/ImageUpload';
import Loading from '../../components/common/Loading';
import { useI18n } from '../../i18n/I18nProvider';

const EMPTY_SCREEN = {
  titleAr: '',
  titleEn: '',
  sloganAr: '',
  sloganEn: '',
  subtitleAr: '',
  subtitleEn: '',
  backgroundImageUrl: '',
};

function ScreenCard({ screen, onChange, onSave, saving, t }) {
  return (
    <form
      className="bg-card rounded-xl shadow-sm border border-gray-100 p-6 mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(screen);
      }}
    >
      <h3 className="text-lg font-bold mb-4 capitalize">{screen.type}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label={t('resources.fields.titleAr')}
          value={screen.titleAr}
          onChange={(e) => onChange({ ...screen, titleAr: e.target.value })}
          required
        />
        <TextInput
          label={t('resources.fields.titleEn')}
          value={screen.titleEn}
          onChange={(e) => onChange({ ...screen, titleEn: e.target.value })}
          required
        />
        <TextInput
          label={t('resources.fields.sloganAr')}
          value={screen.sloganAr}
          onChange={(e) => onChange({ ...screen, sloganAr: e.target.value })}
          required
        />
        <TextInput
          label={t('resources.fields.sloganEn')}
          value={screen.sloganEn}
          onChange={(e) => onChange({ ...screen, sloganEn: e.target.value })}
          required
        />
      </div>
      <TextArea
        label={t('resources.fields.subtitleAr')}
        value={screen.subtitleAr}
        onChange={(e) => onChange({ ...screen, subtitleAr: e.target.value })}
        required
      />
      <TextArea
        label={t('resources.fields.subtitleEn')}
        value={screen.subtitleEn}
        onChange={(e) => onChange({ ...screen, subtitleEn: e.target.value })}
        required
      />
      <ImageUpload
        label={t('resources.fields.backgroundImageUrl')}
        value={screen.backgroundImageUrl || ''}
        onChange={(v) => onChange({ ...screen, backgroundImageUrl: v })}
        uploadType="app-screens"
      />
      <SubmitButton loading={saving}>{t('resources.settings.save')}</SubmitButton>
    </form>
  );
}

export default function AppScreensPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [screens, setScreens] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ['app-screens'],
    queryFn: () => appScreensApi.getAll().then((r) => r.data.data),
  });

  useEffect(() => {
    if (data) {
      setScreens(data.map((item) => ({ ...EMPTY_SCREEN, ...item })));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (screen) => appScreensApi.update(screen.id, {
      titleAr: screen.titleAr,
      titleEn: screen.titleEn,
      sloganAr: screen.sloganAr,
      sloganEn: screen.sloganEn,
      subtitleAr: screen.subtitleAr,
      subtitleEn: screen.subtitleEn,
      backgroundImageUrl: screen.backgroundImageUrl,
    }),
    onSuccess: () => {
      qc.invalidateQueries(['app-screens']);
      toast.success(t('resources.settings.saved'));
    },
    onError: () => toast.error(t('common.errors.generic')),
  });

  const handleChange = (index, next) => {
    const updated = [...screens];
    updated[index] = next;
    setScreens(updated);
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('resources.resources.appScreens.plural')}</h1>
      {screens.map((screen, index) => (
        <ScreenCard
          key={screen.id || screen.type}
          screen={screen}
          onChange={(next) => handleChange(index, next)}
          onSave={(item) => mutation.mutate(item)}
          saving={mutation.isPending && mutation.variables?.id === screen.id}
          t={t}
        />
      ))}
    </div>
  );
}
