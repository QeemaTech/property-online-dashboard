import { useI18n } from '../../i18n/I18nProvider';

export function FormField({ label, error, children, required }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}

export function TextInput({ label, error, required, ...props }) {
  return (
    <FormField label={label} error={error} required={required}>
      <input
        {...props}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${error ? 'border-danger' : 'border-gray-200'} ${props.className || ''}`}
      />
    </FormField>
  );
}

export function TextArea({ label, error, required, ...props }) {
  return (
    <FormField label={label} error={error} required={required}>
      <textarea
        {...props}
        rows={props.rows || 4}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${error ? 'border-danger' : 'border-gray-200'}`}
      />
    </FormField>
  );
}

export function SelectInput({ label, error, required, options = [], placeholder, ...props }) {
  const { t } = useI18n();
  return (
    <FormField label={label} error={error} required={required}>
      <select
        {...props}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${error ? 'border-danger' : 'border-gray-200'}`}
      >
        <option value="">{placeholder || t('common.forms.selectPlaceholder')}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FormField>
  );
}

export function CheckboxInput({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer mb-3">
      <input type="checkbox" {...props} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export function SubmitButton({ loading, children, className = '' }) {
  const { t } = useI18n();
  return (
    <button
      type="submit"
      disabled={loading}
      className={`px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 ${className}`}
    >
      {loading ? t('common.actions.saving') : (children || t('common.actions.save'))}
    </button>
  );
}
