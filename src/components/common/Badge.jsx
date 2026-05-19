import { useI18n } from '../../i18n/I18nProvider';

const variants = {
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-700',
};

export default function Badge({ children, variant = 'default' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function BooleanBadge({ value, trueLabel, falseLabel, trueVariant = 'success', falseVariant = 'danger' }) {
  const { t } = useI18n();
  return (
    <Badge variant={value ? trueVariant : falseVariant}>
      {value ? (trueLabel || t('common.booleans.yes')) : (falseLabel || t('common.booleans.no'))}
    </Badge>
  );
}

export function ActiveBadge({ value }) {
  const { t } = useI18n();
  return (
    <BooleanBadge
      value={value}
      trueLabel={t('common.booleans.active')}
      falseLabel={t('common.booleans.inactive')}
    />
  );
}

export function StatusBadge({ status }) {
  const { t } = useI18n();
  if (!status) return <Badge>-</Badge>;

  const map = {
    ACTIVE: { v: 'success' },
    DRAFT: { v: 'warning' },
    SOLD_OUT: { v: 'danger' },
    COMING_SOON: { v: 'info' },
    ARCHIVED: { v: 'default' },
    NEW: { v: 'info' },
    CONTACTED: { v: 'warning' },
    QUALIFIED: { v: 'success' },
    CLOSED: { v: 'default' },
    REJECTED: { v: 'danger' },
    SUSPENDED: { v: 'warning' },
    DELETED: { v: 'danger' },
  };
  const { v } = map[status] || { v: 'default' };
  const label = map[status] ? t(`common.statuses.${status}`) : status;
  return <Badge variant={v}>{label}</Badge>;
}
