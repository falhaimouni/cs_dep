export const assistantTools = [
  {
    name: 'course_advisor',
    prompt: 'Recommend registerable courses using the study plan prerequisite graph.',
    inputSchema: {
      majorId: 'string',
      completedCreditHours: 'number',
      completedCourses: 'string[]',
      failedCourses: 'string[]',
    },
    outputFormat: {
      recommendations: 'course[]',
      blocked: 'course[] with missingPrerequisites',
      totalRecommendedCredits: 'number',
    },
  },
  {
    name: 'resource_finder',
    prompt: 'Find course resources from the department resource library.',
    inputSchema: { query: 'string', courseId: 'string optional' },
    outputFormat: { courses: 'resourceCourse[]' },
  },
  {
    name: 'university_faq',
    prompt: 'Answer configurable university and department information questions.',
    inputSchema: { question: 'string', language: 'string' },
    outputFormat: { answer: 'string', sources: 'string[]' },
  },
  {
    name: 'career_advisor',
    prompt: 'Recommend a technology career path and roadmap.',
    inputSchema: { answers: 'quizAnswer[]', language: 'string' },
    outputFormat: { paths: 'careerPath[]' },
  },
  {
    name: 'code_reviewer',
    prompt: 'Review pasted code and return line-level educational findings.',
    inputSchema: { code: 'string', language: 'string' },
    outputFormat: { errors: 'finding[]', warnings: 'finding[]', suggestions: 'finding[]', score: 'number' },
  },
  {
    name: 'department_information',
    prompt: 'Return department announcements, contacts, deadlines, and university information.',
    inputSchema: { category: 'string optional', query: 'string optional' },
    outputFormat: { items: 'announcement[]' },
  },
];
