import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Users, ThumbsUp, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-16 text-center">
      <div className="mb-8">
        <Baby className="w-16 h-16 text-purple-600 mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Baby Name Explorer</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Start your journey to find the perfect name for your baby. Create a new project to begin
          collecting and organizing name suggestions.
        </p>
        <button
          onClick={() => navigate('/new')}
          className="px-8 py-3 bg-purple-600 text-white rounded-full text-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Create Your First Project
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-center mb-4">
            <Users className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Create & Share</h3>
          <p className="text-gray-600">
            Start a project and share it with family and friends to collect name suggestions.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-center mb-4">
            <ThumbsUp className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Collaborate</h3>
          <p className="text-gray-600">
            Let loved ones contribute their favorite names and vote on suggestions.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Choose Together</h3>
          <p className="text-gray-600">
            Find the perfect name by seeing which suggestions resonate most with everyone.
          </p>
        </div>
      </div>
    </div>
  );
}