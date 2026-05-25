import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/layout/Footer.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Contact from './pages/Contact.jsx';
import Home from './pages/Home.jsx';
import Resources from './pages/Resources.jsx';
import Roadmaps from './pages/Roadmaps.jsx';
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-ink-900 antialiased dark:bg-ink-950 dark:text-slate-100">
      <div className="fixed inset-0 -z-10 bg-grid bg-[length:34px_34px]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(74,222,128,.15),transparent_32%)]" />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
