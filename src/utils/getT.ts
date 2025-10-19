import { en } from '../../public/locales/en'
import { tr } from '../../public/locales/tr'

// Dinamik çeviri fonksiyonu
export const getTranslations = (lang?: 'tr' | 'en') => {
  // Server-side veya ilk render için parametre olarak verilen dili kullan
  // Client-side'da parametre yoksa localStorage'dan oku
  if (lang) {
    return lang === 'en' ? en : tr
  }
  
  // Client-side ve parametre yoksa
  if (typeof window !== 'undefined') {
    const savedLanguage = (localStorage.getItem('language') as 'tr' | 'en') || 'tr'
    return savedLanguage === 'en' ? en : tr
  }
  
  // Server-side ve parametre yoksa: varsayılan Türkçe
  return tr
}

// Varsayılan export - her zaman Türkçe (hydration uyumlu)
// Client component'lerde useLanguage() hook'unu kullanın
const T = tr

export default T
