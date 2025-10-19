import { en } from '../../public/locales/en'
import { tr } from '../../public/locales/tr'

// Dinamik çeviri fonksiyonu
export const getTranslations = (lang?: 'tr' | 'en') => {
  if (typeof window !== 'undefined') {
    const savedLanguage = (localStorage.getItem('language') as 'tr' | 'en') || 'tr'
    return savedLanguage === 'en' ? en : tr
  }
  // Server-side: varsayılan Türkçe
  return lang === 'en' ? en : tr
}

// Varsayılan export - server-side için Türkçe
const T = getTranslations('tr')

export default T
