import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadsApi } from '../../api/crud';
import toast from 'react-hot-toast';
import { useI18n } from '../../i18n/I18nProvider';

export default function ImageUpload({ value, onChange, label }) {
  const { t } = useI18n();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadsApi.uploadImage(formData);
      onChange(res.data.data.url);
      toast.success(t('common.messages.imageUploaded'));
    } catch (err) {
      toast.error(t('common.messages.imageUploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label || t('resources.fields.image')}</label>
      {value ? (
        <div className="relative inline-block">
          <img src={value.startsWith('http') ? value : `/${value}`} alt="" className="w-32 h-32 object-cover rounded-lg border" />
          <button type="button" onClick={() => onChange('')} className="absolute -top-2 -left-2 bg-danger text-white rounded-full p-0.5">
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          ) : (
            <div className="text-center">
              <Upload size={20} className="mx-auto text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">{t('common.actions.upload')}</span>
            </div>
          )}
        </label>
      )}
    </div>
  );
}
