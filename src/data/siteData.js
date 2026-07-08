import {
  Binary,
  BookOpen,
  Bot,
  CalendarDays,
  Cloud,
  Code2,
  Database,
  Gamepad2,
  Globe2,
  GraduationCap,
  HardDrive,
  Network,
  ShieldCheck,
  Trophy,
  Users,
} from 'lucide-react';

export const stats = [
  { value: '120+', labelKey: 'home.stats.resources' },
  { value: '35+', labelKey: 'home.stats.workshops' },
  { value: '6', labelKey: 'home.stats.tracks' },
  { value: '24/7', labelKey: 'home.stats.access' },
];

export const quickLinks = [
  { titleKey: 'home.quick.drive', descKey: 'home.quick.driveDesc', icon: HardDrive, href: 'https://drive.google.com' },
  { titleKey: 'home.quick.forms', descKey: 'home.quick.formsDesc', icon: Users, href: 'https://forms.google.com' },
  { titleKey: 'home.quick.recordings', descKey: 'home.quick.recordingsDesc', icon: CalendarDays, href: 'https://www.youtube.com/@IT_ZONE_ZU' },
];

export const resources = [
  { key: 'algorithms', icon: Binary, color: 'from-brand-400 to-mint-400' },
  { key: 'dataStructures', icon: Network, color: 'from-coral-400 to-brand-400' },
  { key: 'operatingSystems', icon: Cloud, color: 'from-mint-400 to-brand-300' },
  { key: 'databases', icon: Database, color: 'from-brand-500 to-coral-300' },
  { key: 'programming', icon: Code2, color: 'from-mint-300 to-coral-300' },
  { key: 'webDevelopment', icon: Globe2, color: 'from-brand-300 to-mint-300' },
];

export const workshops = [
  { key: 'reactBootcamp', status: 'upcoming', icon: Code2 },
  { key: 'cyberNight', status: 'upcoming', icon: ShieldCheck },
  { key: 'databaseClinic', status: 'previous', icon: Database },
  { key: 'aiIntro', status: 'previous', icon: Bot },
];

export const roadmaps = [
  { key: 'web', icon: Globe2, steps: ['HTML/CSS', 'JavaScript', 'React', 'APIs', 'Deployment'] },
  { key: 'cyber', icon: ShieldCheck, steps: ['Networking', 'Linux', 'Security Basics', 'CTFs', 'Blue/Red Team'] },
  { key: 'ai', icon: Bot, steps: ['Python', 'Statistics', 'ML', 'Deep Learning', 'MLOps'] },
  { key: 'devops', icon: Cloud, steps: ['Linux', 'Git', 'Docker', 'CI/CD', 'Cloud'] },
  { key: 'game', icon: Gamepad2, steps: ['C# / C++', 'Engines', 'Math', 'Gameplay', 'Publishing'] },
];

export const teamGroups = [
  { key: 'leader', members: ['Farah Alhaimouni'] },
  { key: 'coLeaders', members: ['Ahmad Alhashash'] },
  { key: 'academic', members: ['Zainab Abuzayed', 'Mohammad Abu Srhan','Maryam Ahmad', 'Rousl Al-Shoukha', 'Alaa Alkhrysat'] },
  { key: 'technical', members: ['Farah', 'Raghdah'] },
];

export const communityItems = [
  { key: 'opportunities', icon: GraduationCap },
  { key: 'competitions', icon: Trophy },
  { key: 'internships', icon: BookOpen },
  { key: 'achievements', icon: Users },
]
