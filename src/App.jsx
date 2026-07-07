import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';
import StudentAIAssistant from './components/StudentAIAssistant.jsx';
import Footer from './components/layout/Footer.jsx';
import Navbar from './components/layout/Navbar.jsx';
import AcademicAdvisor from './pages/AcademicAdvisor.jsx';
import CodeReviewer from './pages/CodeReviewer.jsx';
import Contact from './pages/Contact.jsx';
import CourseRecommendations from './pages/CourseRecommendations.jsx';
import DepartmentNews from './pages/DepartmentNews.jsx';
import Home from './pages/Home.jsx';
import ProjectGenerator from './pages/ProjectGenerator.jsx';
import ResourceDetail from './pages/ResourceDetail.jsx';
import Resources from './pages/Resources.jsx';
import Roadmaps from './pages/Roadmaps.jsx';
import StudyPlanner from './pages/StudyPlanner.jsx';
import Team from './pages/Team.jsx';
import Workshops from './pages/Workshops.jsx';

export default function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isArabic = i18n.language?.startsWith('ar');

  useEffect(() => {
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [isArabic]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted text-ink antialiased dark:bg-[#09090b] dark:text-zinc-100">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/advisor" element={<AcademicAdvisor />} />
          <Route path="/courses" element={<CourseRecommendations />} />
          <Route path="/planner" element={<StudyPlanner />} />
          <Route path="/code-reviewer" element={<CodeReviewer />} />
          <Route path="/projects" element={<ProjectGenerator />} />
          <Route path="/news" element={<DepartmentNews />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <StudentAIAssistant />
      <Footer />
    </div>
  );
}
