import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { I18nProvider } from './i18n/I18nProvider';
import DashboardLayout from './components/layout/DashboardLayout';
import Loading from './components/common/Loading';

import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import DevelopersList from './features/developers/DevelopersList';
import ProjectsList from './features/projects/ProjectsList';
import UnitsList from './features/units/UnitsList';
import { CountriesListPage } from './features/locations/CountriesList';
import { CitiesListPage } from './features/locations/CitiesList';
import { AreasListPage } from './features/locations/AreasList';
import { CategoriesListPage } from './features/categories/CategoriesPage';
import { UnitTypesListPage } from './features/unitTypes/UnitTypesPage';
import { AmenitiesListPage } from './features/amenities/AmenitiesPage';
import { FacilitiesListPage } from './features/facilities/FacilitiesPage';
import { BannersListPage } from './features/banners/BannersPage';
import { OffersListPage } from './features/offers/OffersPage';
import { OnboardingListPage } from './features/onboarding/OnboardingPage';
import AppScreensPage from './features/appScreens/AppScreensPage';
import { StaticPagesListPage } from './features/staticPages/StaticPagesPage';
import InquiriesPage from './features/inquiries/InquiriesPage';
import NotificationsPage from './features/notifications/NotificationsPage';
import UsersPage from './features/users/UsersPage';
import SettingsPage from './features/settings/SettingsPage';

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <Loading />;
  if (!admin) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { admin, loading } = useAuth();
  if (loading) return <Loading />;

  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />

        <Route path="developers" element={<DevelopersList />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="units" element={<UnitsList />} />
        <Route path="countries" element={<CountriesListPage />} />
        <Route path="cities" element={<CitiesListPage />} />
        <Route path="areas" element={<AreasListPage />} />
        <Route path="unit-categories" element={<CategoriesListPage />} />
        <Route path="unit-types" element={<UnitTypesListPage />} />
        <Route path="amenities" element={<AmenitiesListPage />} />
        <Route path="facilities" element={<FacilitiesListPage />} />
        <Route path="banners" element={<BannersListPage />} />
        <Route path="offers" element={<OffersListPage />} />
        <Route path="onboarding" element={<OnboardingListPage />} />
        <Route path="app-screens" element={<AppScreensPage />} />
        <Route path="pages" element={<StaticPagesListPage />} />

        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <AppRoutes />
      </I18nProvider>
    </AuthProvider>
  );
}
