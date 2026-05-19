export default function StatsCard({ title, value, icon: Icon, color = 'primary', subtitle }) {
  const colors = {
    primary: 'bg-blue-50 text-primary',
    success: 'bg-green-50 text-success',
    warning: 'bg-yellow-50 text-warning',
    danger: 'bg-red-50 text-danger',
    info: 'bg-indigo-50 text-info',
    secondary: 'bg-teal-50 text-secondary',
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value?.toLocaleString?.() ?? value ?? 0}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
