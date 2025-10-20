import { API_URL } from './api.config';

export interface TranslationObject {
  [key: string]: string;
}

let translationsCache: { [lang: string]: TranslationObject } = {};
let currentLang = 'tr';

// Dil koduna göre tüm çevirileri getir
export async function loadTranslations(langCode: string = 'tr'): Promise<TranslationObject> {
  // Cache'de varsa direkt döndür
  if (translationsCache[langCode]) {
    return translationsCache[langCode];
  }

  try {
    const response = await fetch(`${API_URL}/ceviriler/dil-kod/${langCode}/object`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Çeviriler yüklenemedi (${langCode})`);
      return {};
    }

    const translations = await response.json();
    translationsCache[langCode] = translations;
    return translations;
  } catch (error) {
    console.error(`Çeviri fetch error (${langCode}):`, error);
    return {};
  }
}

// Mevcut dili set et
export function setLanguage(langCode: string) {
  currentLang = langCode;
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', langCode);
  }
}

// Mevcut dili al
export function getLanguage(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'tr';
  }
  return currentLang;
}

// Çeviri fonksiyonu
export function t(key: string, fallback?: string): string {
  const translations = translationsCache[currentLang] || {};
  return translations[key] || fallback || key;
}

// Aktif dilleri getir
export async function getAktifDiller() {
  try {
    const response = await fetch(`${API_URL}/diller/active`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Aktif diller yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Aktif diller fetch error:', error);
    return [];
  }
}

// Client-side için çeviri hook'u hazırlayın
export function initializeTranslations(langCode: string = 'tr') {
  setLanguage(langCode);
  return loadTranslations(langCode);
}

