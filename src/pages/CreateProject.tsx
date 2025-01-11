import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import type { Gender } from '../types';

export default function CreateProject() {
  const navigate = useNavigate();
  const createProject = useProjectStore(state => state.createProject);
  const [parentsNames, setParentsNames] = useState('');
  const [gender, setGender] = useState<Gender>('either');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentsNames.trim()) {
      setError('Please enter the parents\' names');
      return;
    }

    try {
      const projectId = await createProject(parentsNames, gender);
      navigate(`/project/${projectId}`);
    } catch (err) {
      setError('Failed to create project. Please try again.');
    }
  };

  const getBabyIcon = (gender: Gender) => {
    const baseClass = "w-12 h-12 mx-auto mb-2 transition-colors";
    
    switch (gender) {
      case 'boy':
        return (
          <div className={`${baseClass} text-blue-500`}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 8a6 6 0 1112 0A6 6 0 016 8z" fill="currentColor"/>
              <path d="M15 14H9a5 5 0 00-5 5v1a2 2 0 002 2h12a2 2 0 002-2v-1a5 5 0 00-5-5z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'girl':
        return (
          <div className={`${baseClass} text-pink-500`}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 8a6 6 0 1112 0A6 6 0 016 8z" fill="currentColor"/>
              <path d="M12 14c-3.314 0-6 2.686-6 6v1a2 2 0 002 2h8a2 2 0 002-2v-1c0-3.314-2.686-6-6-6z" fill="currentColor"/>
              <circle cx="12" cy="7" r="2" fill="white"/>
            </svg>
          </div>
        );
      default: // either
        return (
          <div className={`${baseClass} text-purple-500`}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 8a6 6 0 1112 0A6 6 0 016 8z" fill="currentColor"/>
              <path d="M12 14c-3.314 0-6 2.686-6 6v1a2 2 0 002 2h8a2 2 0 002-2v-1c0-3.314-2.686-6-6-6z" fill="currentColor"/>
              <path d="M9 7h6M12 4v6" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Create a Baby Name Project</h1>
      <p className="text-gray-600 mb-8">Start your journey to find the perfect name for your baby</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <label htmlFor="parentsNames" className="block text-sm font-medium text-gray-700 mb-2">
            Parents' Names
          </label>
          <input
            type="text"
            id="parentsNames"
            value={parentsNames}
            onChange={(e) => setParentsNames(e.target.value)}
            placeholder="e.g. John and Jane"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">Enter names separated by "and" (e.g., "John and Jane")</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender Preference
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(['boy', 'girl', 'either'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGender(option)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                  gender === option
                    ? option === 'boy'
                      ? 'border-blue-500 bg-blue-50'
                      : option === 'girl'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                {getBabyIcon(option)}
                <span className={`text-center capitalize ${
                  gender === option
                    ? option === 'boy'
                      ? 'text-blue-700'
                      : option === 'girl'
                        ? 'text-pink-700'
                        : 'text-purple-700'
                    : 'text-gray-600'
                }`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}