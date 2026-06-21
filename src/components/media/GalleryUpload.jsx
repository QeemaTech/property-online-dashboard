import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useI18n } from '../../i18n/I18nProvider';

function imageSrc(value) {
  if (!value) return '';
  return value.startsWith('http') ? value : `/${value}`;
}

export default function GalleryUpload({ entityId, galleries = [], onUpload, onRemove, label }) {
  const { t } = useI18n();
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !entityId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sortOrder', String(galleries.length));
      await onUpload(entityId, formData);
      toast.success(t('common.messages.imageUploaded'));
    } catch {
      toast.error(t('common.messages.imageUploadFailed'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = async (galleryId) => {
    setRemovingId(galleryId);
    try {
      await onRemove(galleryId);
      toast.success(t('common.messages.deleted'));
    } catch {
      toast.error(t('common.errors.deleteFailed'));
    } finally {
      setRemovingId(null);
    }
  };

  if (!entityId) {
    return (
      <p className="text-sm text-gray-500 mb-4">{t('common.messages.saveBeforeGallery')}</p>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label || t('resources.fields.gallery')}</label>
      <div className="flex flex-wrap gap-3">
        {galleries.map((item) => (
          <div key={item.id} className="relative">
            <img src={imageSrc(item.url)} alt="" className="w-24 h-24 object-cover rounded-lg border" />
            <button
              type="button"
              disabled={removingId === item.id}
              onClick={() => handleRemove(item.id)}
              className="absolute -top-2 -left-2 bg-danger text-white rounded-full p-0.5 disabled:opacity-50"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          {uploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          ) : (
            <Upload size={18} className="text-gray-400" />
          )}
        </label>
      </div>
    </div>
  );
}
