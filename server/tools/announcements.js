import { readJsonData } from '../dataStore.js';

export async function getAnnouncements() {
  return readJsonData('announcements.json');
}
