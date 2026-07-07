import { readJsonData } from '../dataStore.js';

export async function getMajors() {
  const data = await readJsonData('majors.json');
  return data.majors;
}

function getCourseCatalog(major) {
  return major.semesters.flatMap((semester) =>
    semester.courses.map((course) => ({ ...course, semester: semester.label, sectionId: semester.id }))
  );
}

function getCourseName(catalog, code) {
  const course = catalog.find((item) => item.code === code);
  return course?.name ?? { en: code, ar: code };
}

function getTargetCredits(completedCreditHours) {
  const credits = Number(completedCreditHours || 0);
  if (credits >= 105) return 12;
  if (credits >= 75) return 15;
  return 18;
}

export async function recommendCourses({ majorId = 'cs', completedCourses = [], failedCourses = [], completedCreditHours = 0, maxCredits }) {
  const majors = await getMajors();
  const major = majors.find((item) => item.id === majorId) ?? majors[0];
  const failed = new Set(failedCourses);
  const completed = new Set(completedCourses.filter((code) => !failed.has(code)));
  const targetCredits = maxCredits ?? getTargetCredits(completedCreditHours);
  const catalog = getCourseCatalog(major);

  const evaluated = catalog
    .filter((course) => !completed.has(course.code))
    .map((course) => {
      const missingPrerequisites = course.prerequisites
        .filter((code) => !completed.has(code))
        .map((code) => ({ code, name: getCourseName(catalog, code) }));
      return { ...course, missingPrerequisites, isAvailable: missingPrerequisites.length === 0 };
    });

  const priority = [
    ...evaluated.filter((course) => course.isAvailable && failed.has(course.code)),
    ...evaluated.filter((course) => course.isAvailable && course.sectionId.includes('college')),
    ...evaluated.filter((course) => course.isAvailable && course.sectionId.includes('major-required')),
    ...evaluated.filter((course) => course.isAvailable && course.sectionId.includes('supporting')),
    ...evaluated.filter((course) => course.isAvailable && course.sectionId.includes('elective')),
    ...evaluated.filter((course) => course.isAvailable && course.sectionId.includes('university')),
  ];

  let credits = 0;
  const recommendations = [];
  priority.forEach((course) => {
    const canFit = course.credits === 0 || credits + course.credits <= targetCredits;
    const alreadySelected = recommendations.some((item) => item.code === course.code);
    if (canFit && !alreadySelected) {
      recommendations.push({
        ...course,
        reason: failed.has(course.code)
          ? { en: 'Available as a retake because its prerequisites are satisfied.', ar: 'متاحة للإعادة لأن متطلباتها السابقة مكتملة.' }
          : course.prerequisites.length
            ? { en: 'Available because all prerequisites are completed.', ar: 'متاحة لأن كل المتطلبات السابقة مكتملة.' }
            : { en: 'Available because it has no prerequisite.', ar: 'متاحة لأنها لا تحتاج إلى متطلب سابق.' },
      });
      credits += course.credits;
    }
  });

  const blocked = evaluated
    .filter((course) => !course.isAvailable)
    .map((course) => ({
      ...course,
      reason: {
        en: `Cannot be taken yet. Missing prerequisite${course.missingPrerequisites.length > 1 ? 's' : ''}: ${course.missingPrerequisites.map((item) => item.code).join(', ')}.`,
        ar: `لا يمكن تسجيلها الآن. المتطلبات الناقصة: ${course.missingPrerequisites.map((item) => item.code).join('، ')}.`,
      },
    }));

  return {
    major: {
      id: major.id,
      name: major.name,
      totalCredits: major.totalCredits,
      planNumber: major.planNumber,
    },
    targetCredits,
    totalRecommendedCredits: credits,
    recommendations,
    blocked,
  };
}
