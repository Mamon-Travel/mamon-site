const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface PansiyonTipi {
  id: number;
  kod: string;
  ad: string;
  aciklama?: string;
  sira: number;
  durum: number;
}

export interface FiyatHesaplama {
  toplam_fiyat: number;
  gece_sayisi: number;
  gunluk_fiyatlar: Array<{ tarih: string; fiyat: number }>;
}

export interface MusaitlikKontrol {
  musait: boolean;
  detaylar: Array<{
    tarih: string;
    toplam_oda?: number;
    rezerve_oda?: number;
    bloke_oda?: number;
    musait_oda?: number;
    musait: boolean;
    talep_edilen?: number;
    mesaj?: string;
  }>;
  mesaj: string;
}

// Pansiyon Tipleri
export async function getAktifPansiyonTipleri(): Promise<PansiyonTipi[]> {
  const response = await fetch(`${API_URL}/otel-pansiyon-tipi/aktif`);

  if (!response.ok) {
    throw new Error('Pansiyon tipleri getirilemedi');
  }

  return response.json();
}

// Fiyat Hesaplama
export async function calculateTotalPrice(
  odaTipiId: number,
  girisTarihi: string,
  cikisTarihi: string,
  pansiyonTipiId?: number
): Promise<FiyatHesaplama> {
  const params = new URLSearchParams({
    odaTipiId: odaTipiId.toString(),
    girisTarihi,
    cikisTarihi,
  });

  if (pansiyonTipiId) {
    params.append('pansiyonTipiId', pansiyonTipiId.toString());
  }

  const response = await fetch(
    `${API_URL}/otel-fiyat-takvim/fiyat-hesapla?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Fiyat hesaplanamadı');
  }

  return response.json();
}

// Müsaitlik Kontrolü
export async function checkAvailability(
  odaTipiId: number,
  girisTarihi: string,
  cikisTarihi: string,
  odaSayisi: number = 1
): Promise<MusaitlikKontrol> {
  const params = new URLSearchParams({
    odaTipiId: odaTipiId.toString(),
    girisTarihi,
    cikisTarihi,
    odaSayisi: odaSayisi.toString(),
  });

  const response = await fetch(
    `${API_URL}/otel-stok-takvim/musaitlik-kontrol?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Müsaitlik kontrol edilemedi');
  }

  return response.json();
}

// İptal Politikaları
export async function getIptalPolitikalariByOtelId(
  otelId: number
): Promise<any[]> {
  const response = await fetch(`${API_URL}/otel-iptal-politika/otel/${otelId}`);

  if (!response.ok) {
    throw new Error('İptal politikaları getirilemedi');
  }

  return response.json();
}

// Rezervasyon Oluştur
export interface CreateRezervasyonDto {
  kullanici_id: number;
  oda_tipi_id: number;
  pansiyon_tipi_id?: number;
  giris_tarihi: string;
  cikis_tarihi: string;
  oda_sayisi: number;
  yetiskin_sayisi: number;
  cocuk_sayisi: number;
  bebek_sayisi: number;
  ozel_istekler?: string;
}

export async function createRezervation(
  data: CreateRezervasyonDto,
  token: string
): Promise<any> {
  const response = await fetch(`${API_URL}/rezervasyonlar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Rezervasyon oluşturulamadı');
  }

  return response.json();
}

