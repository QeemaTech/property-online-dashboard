import api from '../lib/axios';

export function createCrudApi(basePath) {
  return {
    getAll: (params) => api.get(basePath, { params }),
    getById: (id) => api.get(`${basePath}/${id}`),
    create: (data) => api.post(basePath, data),
    update: (id, data) => api.put(`${basePath}/${id}`, data),
    remove: (id) => api.delete(`${basePath}/${id}`),
    patch: (id, action, data) => api.patch(`${basePath}/${id}/${action}`, data),
  };
}

function withGalleryApi(basePath, galleryPath) {
  const crud = createCrudApi(basePath);
  return {
    ...crud,
    addGallery: (id, formData) => api.post(`${basePath}/${id}/galleries`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    removeGallery: (galleryId) => api.delete(`${galleryPath}/galleries/${galleryId}`),
  };
}

export const developersApi = withGalleryApi('/admin/developers', '/admin/developers');
export const projectsApi = withGalleryApi('/admin/projects', '/admin/projects');
export const unitsApi = withGalleryApi('/admin/units', '/admin/units');
export const countriesApi = createCrudApi('/admin/locations/countries');
export const citiesApi = createCrudApi('/admin/locations/cities');
export const areasApi = createCrudApi('/admin/locations/areas');
export const unitCategoriesApi = createCrudApi('/admin/unit-categories');
export const unitTypesApi = createCrudApi('/admin/unit-types');
export const amenitiesApi = createCrudApi('/admin/amenities');
export const facilitiesApi = createCrudApi('/admin/facilities');
export const paymentPlansApi = createCrudApi('/admin/payment-plans');
export const bannersApi = createCrudApi('/admin/banners');
export const onboardingApi = createCrudApi('/admin/onboarding');
export const staticPagesApi = createCrudApi('/admin/pages');
export const inquiriesApi = createCrudApi('/admin/inquiries');
export const notificationsApi = createCrudApi('/admin/notifications');
export const mobileUsersApi = createCrudApi('/admin/mobile-users');
export const settingsApi = {
  getAll: () => api.get('/admin/settings'),
  update: (data) => api.put('/admin/settings', data),
};
export const dashboardApi = {
  getOverview: () => api.get('/admin/dashboard/overview'),
};

const UPLOAD_IMAGE_ENDPOINTS = {
  default: '/admin/uploads/image',
  developers: '/admin/uploads/developers/image',
  projects: '/admin/uploads/projects/image',
  'unit-categories': '/admin/uploads/unit-categories/image',
  units: '/admin/uploads/units/image',
};

export const uploadsApi = {
  uploadImage: (formData, type = 'default') => api.post(UPLOAD_IMAGE_ENDPOINTS[type] || UPLOAD_IMAGE_ENDPOINTS.default, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadImages: (formData) => api.post('/admin/uploads/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadFile: (formData) => api.post('/admin/uploads/file', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
