import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/crud';
import StatsCard from '../../components/common/StatsCard';
import Loading from '../../components/common/Loading';
import { StatusBadge } from '../../components/common/Badge';
import { Building2, FolderKanban, Home, Users, MessageSquare, Star, Heart } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export default function DashboardPage() {
  const { t, localizedField, isRtl } = useI18n();
  const alignClass = isRtl ? 'text-right' : 'text-left';
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getOverview().then((r) => r.data.data),
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('resources.dashboard.overview')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title={t('resources.resources.developers.plural')} value={data?.totalDevelopers} icon={Building2} color="primary" />
        <StatsCard title={t('resources.resources.projects.plural')} value={data?.totalProjects} icon={FolderKanban} color="success" />
        <StatsCard title={t('resources.resources.units.plural')} value={data?.totalUnits} icon={Home} color="info" />
        <StatsCard title={t('resources.resources.users.plural')} value={data?.totalMobileUsers} icon={Users} color="secondary" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard title={t('resources.dashboard.totalInquiries')} value={data?.totalInquiries} icon={MessageSquare} color="warning" />
        <StatsCard title={t('resources.dashboard.featuredProjects')} value={data?.featuredProjectsCount} icon={Star} color="primary" />
        <StatsCard title={t('resources.dashboard.favorites')} value={data?.totalFavorites} icon={Heart} color="danger" />
      </div>

      {data?.inquiriesByStatus && (
        <div className="bg-card rounded-xl p-5 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-bold mb-4">{t('resources.dashboard.inquiriesByStatus')}</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(data.inquiriesByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <StatusBadge status={status} />
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.latestInquiries?.length > 0 && (
        <div className="bg-card rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold">{t('resources.dashboard.recentInquiries')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className={`${alignClass} px-4 py-3 font-medium text-gray-500`}>{t('resources.fields.fullName')}</th>
                  <th className={`${alignClass} px-4 py-3 font-medium text-gray-500`}>{t('resources.fields.phone')}</th>
                  <th className={`${alignClass} px-4 py-3 font-medium text-gray-500`}>{t('resources.fields.project')}</th>
                  <th className={`${alignClass} px-4 py-3 font-medium text-gray-500`}>{t('resources.fields.status')}</th>
                </tr>
              </thead>
              <tbody>
                {data.latestInquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-gray-50">
                    <td className="px-4 py-3">{inq.fullName}</td>
                    <td className="px-4 py-3 ltr">{inq.phone}</td>
                    <td className="px-4 py-3">{localizedField(inq.project) || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={inq.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
