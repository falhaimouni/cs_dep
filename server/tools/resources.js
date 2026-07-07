import { readJsonData } from '../dataStore.js';

export async function getResources() {
  const data = await readJsonData('resources.json');
  return data.courses;
}

export async function getResourceById(id) {
  const courses = await getResources();
  return courses.find((course) => course.id === id) ?? null;
}
