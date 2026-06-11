import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { I18nProvider } from './i18n/I18nProvider';
import DashboardLayout from './components/layout/DashboardLayout';
import Loading from './components/common/Loading';

import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import DevelopersList from './features/developers/DevelopersList';
import DeveloperForm from './features/developers/DeveloperForm';
import ProjectsList from './features/projects/ProjectsList';
import ProjectForm from './features/projects/ProjectForm';
import UnitsList from './features/units/UnitsList';
import UnitForm from './features/units/UnitForm';
import { CountriesListPage, CountryFormPage } from './features/locations/CountriesList';
import { CitiesListPage, CityFormPage } from './features/locations/CitiesList';
import { AreasListPage, AreaFormPage } from './features/locations/AreasList';
import { CategoriesListPage, CategoryFormPage } from './features/categories/CategoriesPage';
import { UnitTypesListPage, UnitTypeFormPage } from './features/unitTypes/UnitTypesPage';
import { AmenitiesListPage, AmenityFormPage } from './features/amenities/AmenitiesPage';
import { FacilitiesListPage, FacilityFormPage } from './features/facilities/FacilitiesPage';
import { BannersListPage, BannerFormPage } from './features/banners/BannersPage';
import { OnboardingListPage, OnboardingFormPage } from './features/onboarding/OnboardingPage';
import { StaticPagesListPage, StaticPageFormPage } from './features/staticPages/StaticPagesPage';
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
        <Route path="developers/create" element={<DeveloperForm />} />
        <Route path="developers/:id/edit" element={<DeveloperForm />} />

        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/create" element={<ProjectForm />} />
        <Route path="projects/:id/edit" element={<ProjectForm />} />

        <Route path="units" element={<UnitsList />} />
        <Route path="units/create" element={<UnitForm />} />
        <Route path="units/:id/edit" element={<UnitForm />} />

        <Route path="countries" element={<CountriesListPage />} />
        <Route path="countries/create" element={<CountryFormPage />} />
        <Route path="countries/:id/edit" element={<CountryFormPage />} />

        <Route path="cities" element={<CitiesListPage />} />
        <Route path="cities/create" element={<CityFormPage />} />
        <Route path="cities/:id/edit" element={<CityFormPage />} />

        <Route path="areas" element={<AreasListPage />} />
        <Route path="areas/create" element={<AreaFormPage />} />
        <Route path="areas/:id/edit" element={<AreaFormPage />} />

        <Route path="unit-categories" element={<CategoriesListPage />} />
        <Route path="unit-categories/create" element={<CategoryFormPage />} />
        <Route path="unit-categories/:id/edit" element={<CategoryFormPage />} />

        <Route path="unit-types" element={<UnitTypesListPage />} />
        <Route path="unit-types/create" element={<UnitTypeFormPage />} />
        <Route path="unit-types/:id/edit" element={<UnitTypeFormPage />} />

        <Route path="amenities" element={<AmenitiesListPage />} />
        <Route path="amenities/create" element={<AmenityFormPage />} />
        <Route path="amenities/:id/edit" element={<AmenityFormPage />} />

        <Route path="facilities" element={<FacilitiesListPage />} />
        <Route path="facilities/create" element={<FacilityFormPage />} />
        <Route path="facilities/:id/edit" element={<FacilityFormPage />} />

        <Route path="banners" element={<BannersListPage />} />
        <Route path="banners/create" element={<BannerFormPage />} />
        <Route path="banners/:id/edit" element={<BannerFormPage />} />

        <Route path="onboarding" element={<OnboardingListPage />} />
        <Route path="onboarding/create" element={<OnboardingFormPage />} />
        <Route path="onboarding/:id/edit" element={<OnboardingFormPage />} />

        <Route path="pages" element={<StaticPagesListPage />} />
        <Route path="pages/create" element={<StaticPageFormPage />} />
        <Route path="pages/:id/edit" element={<StaticPageFormPage />} />

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
