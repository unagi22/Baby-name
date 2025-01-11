import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Baby } from 'lucide-react';

export default function NotFound() {
  const location = useLocation();
  const message = location.state?.message || 'The page you are looking for does not exist.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Baby className="w-10 h-10 text-purple-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Create New Project
        </Link>
      </div>
    </div>
  );
}
