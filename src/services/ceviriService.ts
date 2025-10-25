import { API_URL } from './api.config';

export interface TranslationObject {
  [key: string]: any; // nested object veya string olabilir
}

let translationsCache: { [lang: string]: TranslationObject } = {};
let flatTranslationsCache: { [lang: string]: { [key: string]: string } } = {};
let currentLang = 'tr';

// Backend'den gelen düz çevirileri nested objeye çevir
function convertToNestedObject(flatTranslations: { [key: string]: string }): TranslationObject {
  const nested: TranslationObject = {};

  Object.entries(flatTranslations).forEach(([key, value]) => {
    // Eğer key kategori içeriyorsa ayır, yoksa direkt kullan
    const parts = key.split('.');
    
    if (parts.length === 1) {
      // Kategorisiz anahtar (örn: "submit")
      nested[key] = value;
    } else if (parts.length === 2) {
      // Kategori + anahtar (örn: "common.submit")
      const [category, actualKey] = parts;
      if (!nested[category]) {
        nested[category] = {};
      }
      nested[category][actualKey] = value;
    } else {
      // Daha derin nested (örn: "Header.AvatarDropDown.Logout")
      let current = nested;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    }
  });

  return nested;
}

// Dil koduna göre tüm çevirileri getir ve nested yapıya çevir
export async function loadTranslations(langCode: string = 'tr'): Promise<TranslationObject> {
  // Cache'de varsa direkt döndür
  if (translationsCache[langCode]) {
    return translationsCache[langCode];
  }

  try {
    const response = await fetch(`${API_URL}/ceviriler/dil-kod/${langCode}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Çeviriler yüklenemedi (${langCode})`);
      return {};
    }

    const ceviriler = await response.json();
    
    // Backend'den gelen array'i düz objeye çevir
    const flatTranslations: { [key: string]: string } = {};
    ceviriler.forEach((ceviri: any) => {
      // Kategori varsa kategori.anahtar, yoksa sadece anahtar
      const fullKey = ceviri.kategori ? `${ceviri.kategori}.${ceviri.anahtar}` : ceviri.anahtar;
      flatTranslations[fullKey] = ceviri.deger;
    });

    // Düz objeyi cache'e kaydet
    flatTranslationsCache[langCode] = flatTranslations;
    
    // Nested yapıya çevir
    const nestedTranslations = convertToNestedObject(flatTranslations);
    translationsCache[langCode] = nestedTranslations;
    
    return nestedTranslations;
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





