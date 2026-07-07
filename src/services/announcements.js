import announcementsData from '../data/announcements.json';
import { apiOrFallback, apiRequest } from './apiClient.js';

export async function getAnnouncements() {
  return apiOrFallback(
    () => apiRequest('/announcements'),
    () => announcementsData
  );
}
