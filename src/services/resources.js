import resourcesData from '../data/resources.json';
import { apiOrFallback, apiRequest } from './apiClient.js';

export async function getResources() {
  return apiOrFallback(
    () => apiRequest('/resources'),
    () => resourcesData.courses
  );
}

export async function getResourceById(id) {
  return apiOrFallback(
    () => apiRequest(`/resources/${encodeURIComponent(id)}`),
    () => resourcesData.courses.find((course) => course.id === id)
  );
}
