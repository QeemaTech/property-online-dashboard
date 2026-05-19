import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export default function SearchableSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  searchPlaceholder,
  required,
  disabled,
  className = '',
}) {
  const { t, isRtl } = useI18n();
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(() => options.find((o) => o.value === value) || null, [options, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => (o.label || '').toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const pick = (opt) => {
    onChange?.(opt.value);
    setOpen(false);
  };

  return (
    <div className={`mb-4 ${className}`} ref={rootRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          ${open ? 'border-primary ring-2 ring-primary/10' : 'border-gray-200'}
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${selected ? 'text-gray-800' : 'text-gray-400'}`}>
          {selected ? selected.label : (placeholder || t('common.forms.selectPlaceholder'))}
        </span>
        <span className="flex items-center gap-2 text-gray-400">
          {value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange?.('');
              }}
              className="p-1 rounded hover:bg-gray-100"
              title={t('common.actions.cancel')}
            >
              <X size={16} />
            </span>
          )}
          <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder || t('common.table.searchPlaceholder')}
                className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
              />
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">{t('common.empty')}</div>
            ) : (
              <ul role="listbox" className="py-1">
                {filtered.map((opt) => {
                  const active = opt.value === value;
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => pick(opt)}
                        className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-3 py-2 text-sm hover:bg-gray-50 transition-colors
                          ${active ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700'}
                        `}
                      >
                        {opt.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

