'use client'

import { getTranslations } from '@/utils/getT'
import { useEffect, useState } from 'react'

type Language = 'tr' | 'en'

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('tr')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Client-side'da localStorage'dan dil tercihini oku
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
    setIsLoaded(true)
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    localStorage.setItem('language', newLanguage)
    setLanguage(newLanguage)
    // Dil değişikliği için sayfa yenile
    window.location.reload()
  }

  const T = getTranslations(language)

  return {
    language,
    changeLanguage,
    T,
    isLoaded
  }
}
