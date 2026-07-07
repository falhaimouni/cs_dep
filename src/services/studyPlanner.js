import studyPlanData from '../data/studyPlans.json';

export async function generateStudyPlan({ subject, examDate, chaptersCompleted }) {
  const today = new Date();
  const exam = examDate ? new Date(`${examDate}T12:00:00`) : new Date(Date.now() + 6 * 86400000);
  const days = Math.max(3, Math.ceil((exam - today) / 86400000));
  const completed = Number(chaptersCompleted || 0);
  const totalChapters = Math.max(completed + 4, 8);
  const remaining = Math.max(totalChapters - completed, 1);

  return Array.from({ length: Math.min(days, 10) }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const template = studyPlanData.templates[index % studyPlanData.templates.length];
    return {
      id: `${subject || 'subject'}-${index}`,
      date: date.toISOString().slice(0, 10),
      title: template.title,
      chapterRange: `Chapter ${Math.min(totalChapters, completed + index + 1)}${index < remaining ? '' : ' review'}`,
      tasks: ['Read notes', 'Solve 8-12 questions', 'Mark weak points'],
      done: false,
    };
  });
}
