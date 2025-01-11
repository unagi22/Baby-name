import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Baby } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import CreateProject from './pages/CreateProject';
import ProjectView from './pages/ProjectView';
import NotFound from './pages/NotFound';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <nav className="px-4 md:px-6 py-4 flex items-center justify-between border-b border-purple-100">
          <Link to="/" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors">
            <Baby className="w-8 h-8" />
            <span className="text-xl font-semibold">Bebino Ime</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/new"
              className="px-6 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
            >
              + New Project
            </Link>
            <div className="h-6 w-px bg-purple-200 hidden md:block" />
            <LanguageSwitcher />
          </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/new" element={<CreateProject />} />
            <Route path="/project/:id" element={<ProjectView />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}