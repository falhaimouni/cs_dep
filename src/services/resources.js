import resourcesData from '../data/resources.json';

export async function getResources() {
  return resourcesData.courses;
}

export async function getResourceById(id) {
  return resourcesData.courses.find((course) => course.id === id);
}
