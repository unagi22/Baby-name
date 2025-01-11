import React from 'react';
import { useLanguageStore } from '../store/languageStore';
import type { Language } from '../types';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguageStore();

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'crnogorski' ? 'english' : 'crnogorski';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 text-sm bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
    >
      {t('language.switchToEnglish')}
    </button>
  );
}
