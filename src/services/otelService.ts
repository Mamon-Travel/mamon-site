const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface OtelOzellik {
  id: number;
  baslik: string;
  aciklama?: string;
  ikon?: string;
  sira: number;
  durum: number;
}

export interface OdaOzellik {
  id: number;
  baslik: string;
  aciklama?: string;
  ikon?: string;
  sira: number;
  durum: number;
}

export interface OdaTipi {
  id: number;
  otel_id: number;
  ad: string;
  kapasite: number;
  yetiskin_kapasite: number;
  cocuk_kapasite: number;
  oda_sayisi: number;
  metrekare?: number;
  yatak_tipi?: string;
  manzara?: string;
  fiyat?: number;
  aciklama?: string;
  durum: number;
  odaOzellikleri?: OdaOzellik[];
}

export interface OtelDetay {
  id: number;
  otel_id: number;
  kisa_aciklama?: string;
  uzun_aciklama?: string;
  denize_mesafe?: string;
  havalimani_mesafe?: string;
  sehir_merkezi_mesafe?: string;
  oda_sayisi?: number;
  acilis_yili?: number;
}

export interface Otel {
  id: number;
  ad: string;
  slug: string;
  yildiz?: number;
  konsept?: string;
  sehir: string;
  bolge?: string;
  adres?: string;
  telefon?: string;
  email?: string;
  web_site?: string;
  check_in_time?: string;
  check_out_time?: string;
  min_fiyat?: number;
  kapak_gorseli?: string;
  video_url?: string;
  enlem?: number;
  boylam?: number;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  detay?: OtelDetay;
  gorseller?: any[];
  odaTipleri?: OdaTipi[];
  otelOzellikleri?: OtelOzellik[];
}

// Tüm aktif otelleri getir
export async function getAktifOteller(): Promise<Otel[]> {
  try {
    const response = await fetch(`${API_URL}/otel/active`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Oteller yüklenemedi:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Otel fetch error:', error);
    return [];
  }
}

// Slug ile otel detayını getir
export async function getOtelBySlug(slug: string): Promise<Otel | null> {
  try {
    const response = await fetch(`${API_URL}/otel/slug/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Otel yüklenemedi:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Otel fetch error:', error);
    return null;
  }
}

// Otele ait oda tiplerini getir
export async function getOdaTipleri(otelId: number): Promise<OdaTipi[]> {
  try {
    const response = await fetch(`${API_URL}/otel/${otelId}/oda-tipi`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Oda tipleri yüklenemedi:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Oda tipleri fetch error:', error);
    return [];
  }
}

