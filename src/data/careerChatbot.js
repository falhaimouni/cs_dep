export const careerPaths = {
  frontend: {
    name: 'Frontend Development',
    shortName: 'Frontend Developer',
    description: 'Builds the interactive screens, interfaces, and experiences people use in web apps.',
    difficulty: 'Beginner friendly',
    learningTime: '4-7 months',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive UI', 'Accessibility'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Git'],
    roadmap: ['Learn HTML structure', 'Style layouts with CSS and Tailwind', 'Practice JavaScript fundamentals', 'Build React components', 'Create 3 portfolio projects'],
  },
  backend: {
    name: 'Backend Development',
    shortName: 'Backend Developer',
    description: 'Builds the logic, APIs, databases, authentication, and server systems behind applications.',
    difficulty: 'Intermediate',
    learningTime: '6-9 months',
    skills: ['Logic', 'APIs', 'Databases', 'Authentication', 'System design', 'Debugging'],
    technologies: ['Node.js', 'Express', 'SQL', 'MongoDB', 'REST APIs', 'Docker'],
    roadmap: ['Master programming basics', 'Learn APIs and HTTP', 'Practice SQL and database design', 'Build authentication flows', 'Deploy a backend project'],
  },
  fullstack: {
    name: 'Full Stack Development',
    shortName: 'Full Stack Developer',
    description: 'Combines frontend interfaces with backend logic to build complete web products.',
    difficulty: 'Intermediate',
    learningTime: '8-12 months',
    skills: ['Frontend', 'Backend', 'Databases', 'Product thinking', 'Deployment'],
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Next.js', 'Git'],
    roadmap: ['Learn frontend fundamentals', 'Build API-driven apps', 'Connect databases', 'Add authentication', 'Ship a complete product'],
  },
  mobile: {
    name: 'Mobile App Development',
    shortName: 'Mobile App Developer',
    description: 'Creates apps for phones and tablets with smooth interfaces and device-aware features.',
    difficulty: 'Intermediate',
    learningTime: '6-10 months',
    skills: ['UI implementation', 'State management', 'APIs', 'Mobile UX', 'Testing'],
    technologies: ['React Native', 'Flutter', 'Dart', 'Firebase', 'Expo', 'Git'],
    roadmap: ['Learn JavaScript or Dart', 'Build screens and navigation', 'Connect APIs', 'Use local storage and Firebase', 'Publish a small app'],
  },
  game: {
    name: 'Game Development',
    shortName: 'Game Developer',
    description: 'Designs and builds gameplay systems, levels, interactions, physics, and game experiences.',
    difficulty: 'Challenging',
    learningTime: '8-14 months',
    skills: ['Game logic', 'Math basics', 'Creative design', 'Physics', 'Optimization'],
    technologies: ['Unity', 'C#', 'Godot', 'GDScript', 'Blender', 'Git'],
    roadmap: ['Learn programming fundamentals', 'Build small 2D games', 'Study game loops and physics', 'Create levels and mechanics', 'Publish a playable prototype'],
  },
  cybersecurity: {
    name: 'Cybersecurity',
    shortName: 'Cybersecurity Specialist',
    description: 'Protects systems by understanding vulnerabilities, networks, threats, and secure practices.',
    difficulty: 'Intermediate',
    learningTime: '6-12 months',
    skills: ['Security mindset', 'Networking', 'Linux', 'Problem solving', 'Risk analysis'],
    technologies: ['Linux', 'Wireshark', 'Nmap', 'Burp Suite', 'Python', 'TryHackMe'],
    roadmap: ['Learn networking basics', 'Use Linux confidently', 'Study common vulnerabilities', 'Practice ethical labs', 'Build a security notes portfolio'],
  },
  ai: {
    name: 'AI / Machine Learning',
    shortName: 'AI / ML Engineer',
    description: 'Builds models and intelligent systems that learn from data and automate decisions.',
    difficulty: 'Challenging',
    learningTime: '9-15 months',
    skills: ['Math', 'Python', 'Data handling', 'Model training', 'Experimentation'],
    technologies: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
    roadmap: ['Learn Python deeply', 'Study statistics and linear algebra basics', 'Analyze datasets', 'Train simple ML models', 'Build an AI-powered app'],
  },
  data: {
    name: 'Data Science',
    shortName: 'Data Scientist',
    description: 'Turns data into insights using analysis, visualization, statistics, and predictive models.',
    difficulty: 'Intermediate',
    learningTime: '7-12 months',
    skills: ['Analysis', 'Statistics', 'Storytelling', 'Python', 'Visualization'],
    technologies: ['Python', 'Pandas', 'SQL', 'Power BI', 'Tableau', 'Jupyter'],
    roadmap: ['Learn spreadsheets and SQL', 'Practice Python data analysis', 'Visualize insights', 'Study statistics basics', 'Complete dataset case studies'],
  },
  devops: {
    name: 'Cloud / DevOps',
    shortName: 'Cloud / DevOps Engineer',
    description: 'Automates deployment, manages infrastructure, and keeps systems reliable and scalable.',
    difficulty: 'Intermediate to advanced',
    learningTime: '8-14 months',
    skills: ['Automation', 'Linux', 'Cloud', 'CI/CD', 'Monitoring'],
    technologies: ['Linux', 'Docker', 'GitHub Actions', 'AWS', 'Kubernetes', 'Terraform'],
    roadmap: ['Learn Linux and scripting', 'Deploy apps manually', 'Use Docker containers', 'Automate CI/CD', 'Explore cloud infrastructure'],
  },
  uiux: {
    name: 'UI/UX Design',
    shortName: 'UI/UX Designer',
    description: 'Designs useful, beautiful, and understandable digital products based on user needs.',
    difficulty: 'Beginner friendly',
    learningTime: '3-6 months',
    skills: ['Visual design', 'User research', 'Wireframing', 'Prototyping', 'Communication'],
    technologies: ['Figma', 'FigJam', 'Design systems', 'Notion', 'Maze', 'HTML/CSS basics'],
    roadmap: ['Learn design principles', 'Practice Figma daily', 'Create wireframes', 'Prototype app flows', 'Build a case study portfolio'],
  },
  embedded: {
    name: 'Embedded Systems',
    shortName: 'Embedded Systems Developer',
    description: 'Programs hardware-connected devices, sensors, microcontrollers, and low-level systems.',
    difficulty: 'Challenging',
    learningTime: '9-15 months',
    skills: ['Hardware curiosity', 'C/C++', 'Electronics basics', 'Debugging', 'Patience'],
    technologies: ['C', 'C++', 'Arduino', 'ESP32', 'Raspberry Pi', 'MicroPython'],
    roadmap: ['Learn C basics', 'Build Arduino projects', 'Understand sensors and circuits', 'Practice serial communication', 'Create an IoT prototype'],
  },
  software: {
    name: 'Software Engineering',
    shortName: 'Software Engineer',
    description: 'Solves problems with reliable software, clean code, testing, and maintainable architecture.',
    difficulty: 'Intermediate',
    learningTime: '6-12 months',
    skills: ['Problem solving', 'Algorithms', 'Code quality', 'Testing', 'Collaboration'],
    technologies: ['JavaScript', 'Python', 'Java', 'Git', 'Testing tools', 'Databases'],
    roadmap: ['Choose one programming language', 'Practice algorithms gently', 'Build real projects', 'Learn testing and Git', 'Contribute to team projects'],
  },
  networking: {
    name: 'Networking',
    shortName: 'Network Engineer',
    description: 'Designs, configures, and troubleshoots the connections that allow systems to communicate.',
    difficulty: 'Intermediate',
    learningTime: '5-10 months',
    skills: ['Troubleshooting', 'Protocols', 'Security basics', 'Hardware comfort', 'Documentation'],
    technologies: ['Cisco Packet Tracer', 'TCP/IP', 'DNS', 'Linux', 'Wireshark', 'CCNA basics'],
    roadmap: ['Learn TCP/IP basics', 'Practice subnetting', 'Use Packet Tracer', 'Troubleshoot DNS and routing', 'Prepare for CCNA foundations'],
  },
  qa: {
    name: 'QA / Testing',
    shortName: 'QA Engineer',
    description: 'Finds bugs, validates product quality, writes tests, and improves release confidence.',
    difficulty: 'Beginner friendly',
    learningTime: '3-6 months',
    skills: ['Attention to detail', 'Documentation', 'Bug reporting', 'Testing mindset', 'Automation basics'],
    technologies: ['Jira', 'Postman', 'Playwright', 'Cypress', 'JavaScript', 'TestRail'],
    roadmap: ['Learn testing types', 'Write clear bug reports', 'Test web apps manually', 'Practice API testing', 'Automate simple user flows'],
  },
};

export const careerQuestions = [
  {
    id: 'start',
    text: 'When you imagine working in tech, what sounds most exciting?',
    options: [
      { label: 'Designing beautiful screens', scores: { frontend: 3, uiux: 4, mobile: 2 } },
      { label: 'Building the logic behind apps', scores: { backend: 4, software: 3, fullstack: 2 } },
      { label: 'Protecting systems from attacks', scores: { cybersecurity: 5, networking: 2 } },
      { label: 'Teaching computers to learn', scores: { ai: 5, data: 3 } },
    ],
  },
  {
    id: 'thinking',
    text: 'Which kind of challenge do you naturally enjoy?',
    options: [
      { label: 'Creative visual decisions', scores: { uiux: 4, frontend: 3, game: 2 } },
      { label: 'Logical puzzles and rules', scores: { backend: 3, software: 4, cybersecurity: 2 } },
      { label: 'Finding patterns in information', scores: { data: 4, ai: 3, qa: 2 } },
      { label: 'Making systems run smoothly', scores: { devops: 4, networking: 3, backend: 2 } },
    ],
  },
  {
    id: 'workstyle',
    text: 'How do you prefer to work on projects?',
    options: [
      { label: 'Collaborating and sharing ideas', scores: { uiux: 3, fullstack: 2, software: 2, frontend: 2 } },
      { label: 'Deep solo focus time', scores: { backend: 3, ai: 2, cybersecurity: 2, embedded: 2 } },
      { label: 'Testing details carefully', scores: { qa: 5, cybersecurity: 2, software: 2 } },
      { label: 'Switching between many layers', scores: { fullstack: 5, devops: 2, mobile: 2 } },
    ],
  },
  {
    id: 'visual',
    text: 'How interested are you in colors, layout, and user experience?',
    options: [
      { label: 'Very interested', scores: { uiux: 5, frontend: 4, mobile: 2 } },
      { label: 'Somewhat interested', scores: { frontend: 3, fullstack: 2, mobile: 2 } },
      { label: 'I prefer hidden logic', scores: { backend: 4, devops: 2, software: 2 } },
      { label: 'I prefer data or security', scores: { data: 3, cybersecurity: 3, ai: 2 } },
    ],
  },
  {
    id: 'math',
    text: 'How do you feel about math and statistics?',
    options: [
      { label: 'I like them', scores: { ai: 5, data: 4, game: 2 } },
      { label: 'I can learn what I need', scores: { software: 2, backend: 2, fullstack: 2 } },
      { label: 'I prefer minimal math', scores: { frontend: 3, uiux: 3, qa: 2 } },
      { label: 'I like practical calculations', scores: { networking: 3, embedded: 3, devops: 2 } },
    ],
  },
  {
    id: 'platform',
    text: 'What would you rather build first?',
    options: [
      { label: 'Websites and web apps', scores: { frontend: 4, fullstack: 4, backend: 2 } },
      { label: 'Mobile apps', scores: { mobile: 5, frontend: 2, uiux: 2 } },
      { label: 'Games or interactive worlds', scores: { game: 5, software: 2 } },
      { label: 'Tools, APIs, or servers', scores: { backend: 4, devops: 3, software: 2 } },
    ],
  },
  {
    id: 'curiosity',
    text: 'Which topic makes you curious enough to watch videos about it?',
    options: [
      { label: 'Hacking and digital safety', scores: { cybersecurity: 5, networking: 2 } },
      { label: 'AI tools and smart systems', scores: { ai: 5, data: 2 } },
      { label: 'Cloud automation and deployment', scores: { devops: 5, backend: 2 } },
      { label: 'Hardware, sensors, and devices', scores: { embedded: 5, networking: 2 } },
    ],
  },
  {
    id: 'debugging',
    text: 'A feature breaks right before launch. What role sounds most like you?',
    options: [
      { label: 'Trace the bug step by step', scores: { qa: 4, software: 3, backend: 2 } },
      { label: 'Check logs and deployment settings', scores: { devops: 4, backend: 2, networking: 2 } },
      { label: 'Improve the confusing user flow', scores: { uiux: 4, frontend: 3 } },
      { label: 'Investigate if it is a security issue', scores: { cybersecurity: 5, networking: 2 } },
    ],
  },
  {
    id: 'building',
    text: 'Do you prefer building something new or analyzing what already exists?',
    options: [
      { label: 'Building new products', scores: { fullstack: 4, frontend: 3, mobile: 3, software: 2 } },
      { label: 'Analyzing data and behavior', scores: { data: 5, ai: 3, uiux: 2 } },
      { label: 'Improving reliability and quality', scores: { qa: 4, devops: 3, software: 2 } },
      { label: 'Understanding systems deeply', scores: { backend: 3, embedded: 3, networking: 3 } },
    ],
  },
  {
    id: 'final',
    text: 'Pick the sentence that feels most like your future self.',
    options: [
      { label: 'I create polished digital experiences', scores: { uiux: 4, frontend: 4, mobile: 2 } },
      { label: 'I build reliable systems people depend on', scores: { backend: 4, software: 4, devops: 2 } },
      { label: 'I discover risks, bugs, and hidden patterns', scores: { cybersecurity: 4, qa: 3, data: 3 } },
      { label: 'I turn advanced ideas into smart technology', scores: { ai: 4, embedded: 3, game: 2 } },
    ],
  },
];

const careerPathArabic = {
  frontend: {
    name: 'تطوير الواجهات الأمامية',
    shortName: 'مطوّر واجهات أمامية',
    description: 'يبني الشاشات والتجارب التفاعلية التي يستخدمها الناس داخل تطبيقات الويب.',
    difficulty: 'مناسب للمبتدئين',
    learningTime: '4-7 أشهر',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'تصميم متجاوب', 'إتاحة الاستخدام'],
    roadmap: ['تعلّم بنية HTML', 'صمّم الصفحات باستخدام CSS و Tailwind', 'تدرّب على أساسيات JavaScript', 'ابنِ مكونات React', 'أنشئ 3 مشاريع في معرض أعمالك'],
  },
  backend: {
    name: 'تطوير الخلفية البرمجية',
    shortName: 'مطوّر Backend',
    description: 'يبني المنطق والواجهات البرمجية وقواعد البيانات وتسجيل الدخول والأنظمة الخلفية للتطبيقات.',
    difficulty: 'متوسط',
    learningTime: '6-9 أشهر',
    skills: ['المنطق', 'APIs', 'قواعد البيانات', 'المصادقة', 'تصميم الأنظمة', 'اكتشاف الأخطاء'],
    roadmap: ['أتقن أساسيات البرمجة', 'تعلّم HTTP و APIs', 'تدرّب على SQL وتصميم قواعد البيانات', 'ابنِ أنظمة تسجيل دخول', 'انشر مشروع Backend كامل'],
  },
  fullstack: {
    name: 'تطوير Full Stack',
    shortName: 'مطوّر Full Stack',
    description: 'يجمع بين واجهات المستخدم والمنطق الخلفي لبناء منتجات ويب كاملة.',
    difficulty: 'متوسط',
    learningTime: '8-12 شهرا',
    skills: ['Frontend', 'Backend', 'قواعد البيانات', 'تفكير المنتج', 'النشر'],
    roadmap: ['تعلّم أساسيات الواجهة الأمامية', 'ابنِ تطبيقات تعتمد على APIs', 'اربط قواعد البيانات', 'أضف تسجيل الدخول', 'انشر منتجا كاملا'],
  },
  mobile: {
    name: 'تطوير تطبيقات الموبايل',
    shortName: 'مطوّر تطبيقات موبايل',
    description: 'ينشئ تطبيقات للهواتف والأجهزة اللوحية بواجهات سلسة وميزات مناسبة للأجهزة.',
    difficulty: 'متوسط',
    learningTime: '6-10 أشهر',
    skills: ['تنفيذ الواجهات', 'إدارة الحالة', 'APIs', 'تجربة الموبايل', 'الاختبار'],
    roadmap: ['تعلّم JavaScript أو Dart', 'ابنِ الشاشات والتنقل', 'اربط APIs', 'استخدم التخزين المحلي و Firebase', 'انشر تطبيقا صغيرا'],
  },
  game: {
    name: 'تطوير الألعاب',
    shortName: 'مطوّر ألعاب',
    description: 'يصمم ويبني أنظمة اللعب والمراحل والتفاعلات والفيزياء وتجارب الألعاب.',
    difficulty: 'متقدم',
    learningTime: '8-14 شهرا',
    skills: ['منطق الألعاب', 'أساسيات الرياضيات', 'التصميم الإبداعي', 'الفيزياء', 'تحسين الأداء'],
    roadmap: ['تعلّم أساسيات البرمجة', 'ابنِ ألعاب 2D صغيرة', 'افهم حلقة اللعبة والفيزياء', 'أنشئ مراحل وآليات لعب', 'انشر نموذجا قابلا للعب'],
  },
  cybersecurity: {
    name: 'الأمن السيبراني',
    shortName: 'مختص أمن سيبراني',
    description: 'يحمي الأنظمة من خلال فهم الثغرات والشبكات والتهديدات والممارسات الآمنة.',
    difficulty: 'متوسط',
    learningTime: '6-12 شهرا',
    skills: ['عقلية أمنية', 'الشبكات', 'Linux', 'حل المشكلات', 'تحليل المخاطر'],
    roadmap: ['تعلّم أساسيات الشبكات', 'استخدم Linux بثقة', 'ادرس الثغرات الشائعة', 'تدرّب في مختبرات أخلاقية', 'ابنِ ملف ملاحظات أمنية'],
  },
  ai: {
    name: 'الذكاء الاصطناعي وتعلم الآلة',
    shortName: 'مهندس AI / ML',
    description: 'يبني نماذج وأنظمة ذكية تتعلم من البيانات وتساعد في أتمتة القرارات.',
    difficulty: 'متقدم',
    learningTime: '9-15 شهرا',
    skills: ['الرياضيات', 'Python', 'معالجة البيانات', 'تدريب النماذج', 'التجربة والتحسين'],
    roadmap: ['تعلّم Python بعمق', 'ادرس أساسيات الإحصاء والجبر الخطي', 'حلّل مجموعات بيانات', 'درّب نماذج ML بسيطة', 'ابنِ تطبيقا مدعوما بالذكاء الاصطناعي'],
  },
  data: {
    name: 'علم البيانات',
    shortName: 'عالم بيانات',
    description: 'يحوّل البيانات إلى رؤى باستخدام التحليل والتصور والإحصاء والنماذج التنبؤية.',
    difficulty: 'متوسط',
    learningTime: '7-12 شهرا',
    skills: ['التحليل', 'الإحصاء', 'سرد النتائج', 'Python', 'تصور البيانات'],
    roadmap: ['تعلّم الجداول و SQL', 'تدرّب على تحليل البيانات ب Python', 'اعرض النتائج بصريا', 'ادرس أساسيات الإحصاء', 'أنجز دراسات حالة على بيانات حقيقية'],
  },
  devops: {
    name: 'السحابة و DevOps',
    shortName: 'مهندس Cloud / DevOps',
    description: 'يؤتمت النشر ويدير البنية التحتية ويحافظ على موثوقية الأنظمة وقابليتها للتوسع.',
    difficulty: 'متوسط إلى متقدم',
    learningTime: '8-14 شهرا',
    skills: ['الأتمتة', 'Linux', 'السحابة', 'CI/CD', 'المراقبة'],
    roadmap: ['تعلّم Linux والسكريبتات', 'انشر التطبيقات يدويا', 'استخدم Docker', 'أتمت CI/CD', 'استكشف البنية السحابية'],
  },
  uiux: {
    name: 'تصميم UI/UX',
    shortName: 'مصمم UI/UX',
    description: 'يصمم منتجات رقمية مفيدة وجميلة وسهلة الفهم بناء على احتياجات المستخدمين.',
    difficulty: 'مناسب للمبتدئين',
    learningTime: '3-6 أشهر',
    skills: ['التصميم البصري', 'بحث المستخدمين', 'Wireframes', 'النمذجة التفاعلية', 'التواصل'],
    roadmap: ['تعلّم مبادئ التصميم', 'تدرّب يوميا على Figma', 'أنشئ Wireframes', 'صمم نماذج تفاعلية', 'ابنِ دراسات حالة لمعرض أعمالك'],
  },
  embedded: {
    name: 'الأنظمة المدمجة',
    shortName: 'مطوّر أنظمة مدمجة',
    description: 'يبرمج الأجهزة المتصلة والحساسات والمتحكمات الدقيقة والأنظمة منخفضة المستوى.',
    difficulty: 'متقدم',
    learningTime: '9-15 شهرا',
    skills: ['فضول تجاه العتاد', 'C/C++', 'أساسيات الإلكترونيات', 'اكتشاف الأخطاء', 'الصبر'],
    roadmap: ['تعلّم أساسيات C', 'ابنِ مشاريع Arduino', 'افهم الحساسات والدوائر', 'تدرّب على الاتصال التسلسلي', 'أنشئ نموذج IoT بسيط'],
  },
  software: {
    name: 'هندسة البرمجيات',
    shortName: 'مهندس برمجيات',
    description: 'يحل المشكلات ببرمجيات موثوقة وكود نظيف واختبارات وبنية قابلة للصيانة.',
    difficulty: 'متوسط',
    learningTime: '6-12 شهرا',
    skills: ['حل المشكلات', 'الخوارزميات', 'جودة الكود', 'الاختبار', 'التعاون'],
    roadmap: ['اختر لغة برمجة واحدة', 'تدرّب على الخوارزميات تدريجيا', 'ابنِ مشاريع حقيقية', 'تعلّم الاختبار و Git', 'شارك في مشاريع جماعية'],
  },
  networking: {
    name: 'الشبكات',
    shortName: 'مهندس شبكات',
    description: 'يصمم ويضبط ويحل مشاكل الاتصالات التي تسمح للأنظمة بالتواصل.',
    difficulty: 'متوسط',
    learningTime: '5-10 أشهر',
    skills: ['حل الأعطال', 'البروتوكولات', 'أساسيات الأمن', 'فهم العتاد', 'التوثيق'],
    roadmap: ['تعلّم أساسيات TCP/IP', 'تدرّب على Subnetting', 'استخدم Packet Tracer', 'حل مشاكل DNS والتوجيه', 'ابدأ بأساسيات CCNA'],
  },
  qa: {
    name: 'ضمان الجودة والاختبار',
    shortName: 'مهندس QA',
    description: 'يكتشف الأخطاء ويتحقق من جودة المنتج ويكتب الاختبارات ويحسّن الثقة قبل الإطلاق.',
    difficulty: 'مناسب للمبتدئين',
    learningTime: '3-6 أشهر',
    skills: ['الانتباه للتفاصيل', 'التوثيق', 'كتابة تقارير الأخطاء', 'عقلية الاختبار', 'أساسيات الأتمتة'],
    roadmap: ['تعلّم أنواع الاختبارات', 'اكتب تقارير أخطاء واضحة', 'اختبر تطبيقات ويب يدويا', 'تدرّب على اختبار APIs', 'أتمت مسارات مستخدم بسيطة'],
  },
};

const arabicQuestionText = [
  {
    text: 'عندما تتخيل نفسك تعمل في التقنية، ما الشيء الأكثر حماسا بالنسبة لك؟',
    options: ['تصميم شاشات جميلة', 'بناء منطق التطبيقات من الداخل', 'حماية الأنظمة من الهجمات', 'تعليم الحاسوب كيف يتعلم'],
  },
  {
    text: 'أي نوع من التحديات تستمتع به غالبا؟',
    options: ['قرارات بصرية وإبداعية', 'ألغاز منطقية وقواعد واضحة', 'اكتشاف أنماط داخل المعلومات', 'جعل الأنظمة تعمل بسلاسة'],
  },
  {
    text: 'كيف تفضّل العمل على المشاريع؟',
    options: ['التعاون وتبادل الأفكار', 'تركيز عميق بشكل فردي', 'فحص التفاصيل بعناية', 'التنقل بين طبقات كثيرة من المشروع'],
  },
  {
    text: 'ما مدى اهتمامك بالألوان والتخطيط وتجربة المستخدم؟',
    options: ['مهتم جدا', 'مهتم إلى حد ما', 'أفضل المنطق المخفي خلف التطبيق', 'أفضل البيانات أو الأمن'],
  },
  {
    text: 'كيف تشعر تجاه الرياضيات والإحصاء؟',
    options: ['أحبها', 'أستطيع تعلم ما أحتاجه', 'أفضل أقل قدر ممكن من الرياضيات', 'أحب الحسابات العملية'],
  },
  {
    text: 'ماذا تفضّل أن تبني أولا؟',
    options: ['مواقع وتطبيقات ويب', 'تطبيقات موبايل', 'ألعاب أو عوالم تفاعلية', 'أدوات أو APIs أو خوادم'],
  },
  {
    text: 'أي موضوع يجعلك فضوليا لدرجة مشاهدة فيديوهات عنه؟',
    options: ['الاختراق والحماية الرقمية', 'أدوات الذكاء الاصطناعي والأنظمة الذكية', 'الأتمتة السحابية والنشر', 'الأجهزة والحساسات والعتاد'],
  },
  {
    text: 'تعطلت ميزة قبل الإطلاق مباشرة. أي دور يشبهك؟',
    options: ['أتتبع الخطأ خطوة بخطوة', 'أفحص السجلات وإعدادات النشر', 'أحسن تجربة المستخدم المربكة', 'أتحقق إن كانت مشكلة أمنية'],
  },
  {
    text: 'هل تفضّل بناء شيء جديد أم تحليل شيء موجود؟',
    options: ['بناء منتجات جديدة', 'تحليل البيانات والسلوك', 'تحسين الموثوقية والجودة', 'فهم الأنظمة بعمق'],
  },
  {
    text: 'اختر الجملة الأقرب لنسختك المستقبلية.',
    options: ['أصنع تجارب رقمية مصقولة', 'أبني أنظمة موثوقة يعتمد عليها الناس', 'أكتشف المخاطر والأخطاء والأنماط المخفية', 'أحول الأفكار المتقدمة إلى تقنية ذكية'],
  },
];

export function getCareerQuestions(language = 'en') {
  if (!language?.startsWith('ar')) return careerQuestions;

  return careerQuestions.map((question, questionIndex) => ({
    ...question,
    text: arabicQuestionText[questionIndex].text,
    options: question.options.map((option, optionIndex) => ({
      ...option,
      label: arabicQuestionText[questionIndex].options[optionIndex],
    })),
  }));
}

export function analyzeCareerAnswers(answers, language = 'en') {
  const totals = Object.keys(careerPaths).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  const maxPossible = Object.keys(careerPaths).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  const isArabic = language?.startsWith('ar');

  careerQuestions.forEach((question) => {
    Object.keys(careerPaths).forEach((careerKey) => {
      const bestForQuestion = Math.max(...question.options.map((option) => option.scores[careerKey] || 0));
      maxPossible[careerKey] += bestForQuestion;
    });
  });

  answers.forEach((answer) => {
    Object.entries(answer.scores).forEach(([careerKey, score]) => {
      totals[careerKey] += score;
    });
  });

  return Object.entries(totals)
    .map(([careerKey, score]) => {
      const match = maxPossible[careerKey] ? Math.round((score / maxPossible[careerKey]) * 100) : 0;
      const localizedProfile = isArabic ? careerPathArabic[careerKey] : {};
      return {
        key: careerKey,
        score,
        match: Math.min(98, Math.max(42, match)),
        ...careerPaths[careerKey],
        ...localizedProfile,
      };
    })
    .sort((a, b) => b.score - a.score || b.match - a.match)
    .slice(0, 3);
}
