import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Baby } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import CreateProject from './pages/CreateProject';
import ProjectView from './pages/ProjectView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <nav className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Baby className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold">Baby Name Explorer</h1>
          </div>
          <a
            href="/new"
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full flex items-center space-x-1 hover:bg-purple-200 transition-colors"
          >
            <span>New Project</span>
          </a>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/new" element={<CreateProject />} />
          <Route path="/project/:id" element={<ProjectView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;