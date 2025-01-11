import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useLanguageStore } from '../store/languageStore';
import type { Gender } from '../types';

export default function CreateProject() {
  const navigate = useNavigate();
  const { createProject } = useProjectStore();
  const { t } = useLanguageStore();
  const [parentsNames, setParentsNames] = useState('');
  const [genderPreference, setGenderPreference] = useState<Gender>('either');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentsNames.trim()) {
      setError(t('createProject.errorMessage'));
      return;
    }

    try {
      const projectId = await createProject(parentsNames, genderPreference);
      navigate(`/project/${projectId}`);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const getBabyIcon = (gender: Gender) => {
    const baseClass = "w-6 h-6 mx-auto mb-2 transition-colors";
    
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="max-w-md mx-auto pt-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Baby className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('createProject.title')}
          </h1>
          <p className="text-gray-600">
            {t('createProject.description')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('createProject.parentsNames')}
            </label>
            <input
              type="text"
              value={parentsNames}
              onChange={(e) => setParentsNames(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={t('createProject.parentsNamesPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('createProject.genderPreference')}
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['boy', 'girl', 'either'] as const).map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => setGenderPreference(gender)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                    genderPreference === gender
                      ? gender === 'boy'
                        ? 'border-blue-500 bg-blue-50'
                        : gender === 'girl'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  {getBabyIcon(gender)}
                  <span className={`mt-2 text-sm text-center ${
                    genderPreference === gender
                      ? gender === 'boy'
                        ? 'text-blue-700'
                        : gender === 'girl'
                        ? 'text-pink-700'
                        : 'text-purple-700'
                      : 'text-gray-600'
                  }`}>
                    {t(`createProject.${gender}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            {t('createProject.createButton')}
          </button>
        </form>
      </div>
    </div>
  );
}