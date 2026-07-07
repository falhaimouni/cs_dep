import { apiRequest } from './apiClient.js';

export async function getUniversityNews() {
  return apiRequest('/news/university');
}
