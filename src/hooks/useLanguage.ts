'use client'

import { loadTranslations, TranslationObject } from '@/services/ceviriService'
import { useEffect, useState } from 'react'

type Language = 'tr' | 'en'

// Proxy handler - undefined erişimlerinde güvenli sonuç döndür
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

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('tr')
  const [translations, setTranslations] = useState<TranslationObject>(createSafeProxy({}))
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Client-side'da localStorage'dan dil tercihini oku
    const savedLanguage = localStorage.getItem('language') as Language
    const finalLanguage = (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) 
      ? savedLanguage 
      : 'tr'
    
    setLanguage(finalLanguage)
    
    // Backend'den çevirileri yükle
    loadTranslations(finalLanguage).then((loadedTranslations) => {
      setTranslations(createSafeProxy(loadedTranslations))
      setIsLoaded(true)
      console.log(`✅ Çeviriler yüklendi (${finalLanguage}):`, Object.keys(loadedTranslations).length, 'kategori')
    }).catch((error) => {
      console.error('❌ Çeviriler yüklenemedi:', error)
      // Backend yoksa güvenli boş proxy kullan
      setTranslations(createSafeProxy({}))
      setIsLoaded(true)
    })
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    localStorage.setItem('language', newLanguage)
    setLanguage(newLanguage)
    
    // Backend'den yeni dili yükle
    setIsLoaded(false)
    loadTranslations(newLanguage).then((loadedTranslations) => {
      setTranslations(createSafeProxy(loadedTranslations))
      setIsLoaded(true)
      // Sayfa yenile
      window.location.reload()
    })
  }

  return {
    language,
    changeLanguage,
    T: translations,
    isLoaded
  }
}
