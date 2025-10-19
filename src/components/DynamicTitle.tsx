'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Sayfa başlıkları çevirileri
const pageTitles: Record<string, { tr: string; en: string }> = {
  '/': { tr: 'Ana Sayfa', en: 'Home' },
  '/stay-categories': { tr: 'Konaklama', en: 'Stays' },
  '/car-categories': { tr: 'Araçlar', en: 'Cars' },
  '/experience-categories': { tr: 'Deneyimler', en: 'Experiences' },
  '/real-estate-categories': { tr: 'Emlak', en: 'Real Estate' },
  '/flight-categories': { tr: 'Uçuşlar', en: 'Flights' },
  '/account': { tr: 'Hesabım', en: 'Account' },
  '/account-password': { tr: 'Şifre', en: 'Password' },
  '/account-savelists': { tr: 'Kayıtlı İlanlar', en: 'Saved Listings' },
  '/account-billing': { tr: 'Ödemeler', en: 'Payments & Payouts' },
  '/login': { tr: 'Giriş Yap', en: 'Login' },
  '/signup': { tr: 'Kayıt Ol', en: 'Sign Up' },
  '/about': { tr: 'Hakkımızda', en: 'About' },
  '/contact': { tr: 'İletişim', en: 'Contact' },
}

const siteName = 'Mamon Travel'

export default function DynamicTitle() {
  const { language, isLoaded } = useLanguage()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoaded) return

    // Pathname'e göre başlık bul
    let pageTitle = pageTitles[pathname]

    // Eğer tam eşleşme yoksa, alt path'leri kontrol et
    if (!pageTitle) {
      for (const [path, title] of Object.entries(pageTitles)) {
        if (pathname.startsWith(path) && path !== '/') {
          pageTitle = title
          break
        }
      }
    }

    // Başlığı ayarla
    if (pageTitle) {
      const title = language === 'tr' ? pageTitle.tr : pageTitle.en
      document.title = `${title} - ${siteName}`
    } else {
      // Varsayılan başlık
      document.title = siteName
    }
  }, [pathname, language, isLoaded])

  return null // Bu component hiçbir şey render etmez
}

