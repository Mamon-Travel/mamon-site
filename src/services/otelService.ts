const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Otel {
  id: number;
  hizmet_id: number;
  ad: string;
  slug: string;
  yildiz: number;
  konsept?: string;
  sehir?: string;
  bolge?: string;
  adres?: string;
  telefon?: string;
  email?: string;
  web_site?: string;
  check_in_time: string;
  check_out_time: string;
  min_fiyat?: number;
  kapak_gorseli?: string;
  video_url?: string;
  enlem?: number;
  boylam?: number;
  durum: number;
  detay?: OtelDetay;
  gorseller?: OtelGorsel[];
  odaTipleri?: OdaTipi[];
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
  renovasyon_yili?: number;
  kat_sayisi?: number;
  onemli_bilgiler?: string;
  covid_onlemleri?: string;
  cocuk_politikasi?: string;
  evcil_hayvan_politikasi?: string;
  iptal_politikasi?: string;
}

export interface OtelGorsel {
  id: number;
  otel_id: number;
  gorsel_url: string;
  baslik?: string;
  sira: number;
  gorsel_tipi: string;
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
}

export async function getAllOteller(): Promise<Otel[]> {
  const response = await fetch(`${API_URL}/otel`);

  if (!response.ok) {
    throw new Error('Oteller getirilemedi');
  }

  return response.json();
}

export async function getAktifOteller(): Promise<Otel[]> {
  const response = await fetch(`${API_URL}/otel/active`);

  if (!response.ok) {
    // Fallback: tüm otelleri getir ve filtrele
    const allOteller = await getAllOteller();
    return allOteller.filter(otel => otel.durum === 1);
  }

  return response.json();
}

export async function getOtelBySlug(slug: string): Promise<Otel> {
  const response = await fetch(`${API_URL}/otel/slug/${slug}`);

  if (!response.ok) {
    throw new Error('Otel bulunamadı');
  }

  return response.json();
}

export async function getOtelById(id: number): Promise<Otel> {
  const response = await fetch(`${API_URL}/otel/${id}`);

  if (!response.ok) {
    throw new Error('Otel bulunamadı');
  }

  return response.json();
}

export async function getOtellerBySehir(sehir: string): Promise<Otel[]> {
  const response = await fetch(`${API_URL}/otel/sehir/${sehir}`);

  if (!response.ok) {
    throw new Error('Oteller getirilemedi');
  }

  return response.json();
}

export async function getOtelOdaTipleri(otelId: number): Promise<OdaTipi[]> {
  const response = await fetch(`${API_URL}/otel/${otelId}/oda-tipi`);

  if (!response.ok) {
    throw new Error('Oda tipleri getirilemedi');
  }

  return response.json();
}

// Alias for backward compatibility
export const getOdaTipleri = getOtelOdaTipleri;
