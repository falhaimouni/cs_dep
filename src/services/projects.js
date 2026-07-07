import projectsData from '../data/projects.json';

export async function generateProject({ course, difficulty, category }) {
  const project =
    projectsData.projects.find((item) =>
      (!course || item.course === course) &&
      (!difficulty || item.difficulty === difficulty) &&
      (!category || item.category === category)
    ) ?? projectsData.projects[0];

  return project;
}

export async function getProjectOptions() {
  return {
    courses: [...new Set(projectsData.projects.map((item) => item.course))],
    difficulties: [...new Set(projectsData.projects.map((item) => item.difficulty))],
    categories: [...new Set(projectsData.projects.map((item) => item.category))],
  };
}
