const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface FiltrKriterleri {
  bolgeler?: string[];
  kategoriler?: number[];
  ozellikler?: number[];
  yildiz?: number[];
  konseptler?: string[];
  min_fiyat?: number;
  max_fiyat?: number;
}

export interface DinamikSayfa {
  id: number;
  baslik: string;
  slug: string;
  aciklama?: string;
  filtre_kriterleri: FiltrKriterleri;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  kapak_gorseli?: string;
  sira: number;
  durum: number;
  ust_icerik?: string;
  alt_icerik?: string;
}

export interface DinamikSayfaWithOteller {
  sayfa: DinamikSayfa;
  oteller: any[];
}

// Aktif sayfaları getir (Navigasyon için)
export async function getAktifDinamikSayfalar(): Promise<DinamikSayfa[]> {
  try {
    const response = await fetch(`${API_URL}/dinamik-sayfalar/aktif`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Aktif sayfalar yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Aktif sayfa fetch error:', error);
    return [];
  }
}

// Slug ile sayfa ve otelleri getir
export async function getDinamikSayfaWithOteller(
  slug: string
): Promise<DinamikSayfaWithOteller> {
  try {
    const response = await fetch(
      `${API_URL}/dinamik-sayfalar/slug/${slug}/oteller`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Sayfa yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Sayfa fetch error:', error);
    throw error;
  }
}

