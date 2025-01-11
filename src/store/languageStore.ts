import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations } from '../i18n/translations';
import type { Language } from '../types';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'crnogorski',
      setLanguage: (language: Language) => set({ language }),
      t: (key: string) => {
        const { language } = get();
        const keys = key.split('.');
        let value: any = translations[language];
        
        for (const k of keys) {
          value = value?.[k];
        }
        
        return value || key;
      }
    }),
    {
      name: 'language-store'
    }
  )
);
