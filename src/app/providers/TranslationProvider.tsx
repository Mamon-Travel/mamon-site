'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  loadTranslations,
  setLanguage,
  getLanguage,
  TranslationObject,
} from '@/services/ceviriService';

interface TranslationContextType {
  t: (key: string, fallback?: string) => string;
  currentLang: string;
  changeLang: (lang: string) => Promise<void>;
  translations: TranslationObject;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key: string, fallback?: string) => fallback || key,
  currentLang: 'tr',
  changeLang: async () => {},
  translations: {},
});

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState('tr');
  const [translations, setTranslations] = useState<TranslationObject>({});

  useEffect(() => {
    const savedLang = getLanguage();
    setCurrentLang(savedLang);
    loadInitialTranslations(savedLang);
  }, []);

  const loadInitialTranslations = async (lang: string) => {
    const trans = await loadTranslations(lang);
    setTranslations(trans);
  };

  const changeLang = async (lang: string) => {
    setLanguage(lang);
    setCurrentLang(lang);
    const trans = await loadTranslations(lang);
    setTranslations(trans);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  return (
    <TranslationContext.Provider value={{ t, currentLang, changeLang, translations }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}









