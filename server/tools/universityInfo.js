import { readJsonData } from '../dataStore.js';

export async function getUniversityInfo() {
  return readJsonData('universityInfo.json');
}
