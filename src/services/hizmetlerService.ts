// Hizmetler API servisi
export interface Hizmet {
  id: number
  ad: string
  slug: string
  aciklama: string
  ikon: string
  renk: string
  sira: number
  aktif: boolean
  url: string
  meta_title: string
  meta_description: string
  created_at: string
  updated_at: string
}

const API_BASE_URL = 'http://localhost:3000'

export async function getHizmetler(): Promise<Hizmet[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/hizmetler/active`)
    if (!response.ok) {
      throw new Error('Hizmetler yüklenemedi')
    }
    return await response.json()
  } catch (error) {
    console.error('Hizmetler API hatası:', error)
    // Fallback olarak boş array döndür
    return []
  }
}

export async function getHizmetBySlug(slug: string): Promise<Hizmet | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/hizmetler/slug/${slug}`)
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch (error) {
    console.error('Hizmet API hatası:', error)
    return null
  }
}
