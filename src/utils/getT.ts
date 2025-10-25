import { loadTranslations, TranslationObject } from '@/services/ceviriService'

// Backend'den yüklenen çeviriler için cache
let dynamicTranslations: { [lang: string]: TranslationObject } = {}
let isLoading = false

// Proxy handler - undefined erişimlerinde boş string döndür
const createSafeProxy = (obj: any = {}): any => {
  return new Proxy(obj, {
    get(target, prop) {
      // Symbol ve özel metodları bypass et
      if (typeof prop === 'symbol' || prop === 'toJSON' || prop === 'toString' || prop === 'valueOf') {
        return target[prop]
      }
      
      if (prop in target) {
        const value = target[prop]
        // Eğer değer obje ise (ama null, function, array değilse), onu da proxy'le
        if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
          return createSafeProxy(value)
        }
        return value
      }
      // Yoksa boş string döndür
      return ''
    }
  })
}

// Dinamik çeviri fonksiyonu - Sadece backend'den yükler
export const getTranslations = (lang?: 'tr' | 'en') => {
  const selectedLang = lang || 'tr'
  
  // Eğer dinamik çeviriler yüklenmişse onları kullan
  if (dynamicTranslations[selectedLang]) {
    return createSafeProxy(dynamicTranslations[selectedLang])
  }
  
  // Client-side'daysa backend'den yüklemeyi başlat
  if (typeof window !== 'undefined' && !isLoading) {
    isLoading = true
    loadTranslations(selectedLang).then((translations) => {
      dynamicTranslations[selectedLang] = translations
      isLoading = false
      console.log(`✅ Çeviriler backend'den yüklendi (${selectedLang}):`, Object.keys(translations).length, 'kategori')
    }).catch((error) => {
      isLoading = false
      console.error(`❌ Backend'den çeviriler yüklenemedi (${selectedLang}):`, error)
    })
  }
  
  // Güvenli boş proxy döndür (backend yüklenene kadar)
  return createSafeProxy({})
}

// Varsayılan export - güvenli boş proxy
const T = createSafeProxy({})

export default T
