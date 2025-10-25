const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface DovizKur {
  id: number;
  para_birimi: string;
  para_adi: string;
  alis_kuru: number;
  satis_kuru: number;
  tcmb_alis: number;
  tcmb_satis: number;
  yuzde_marj: number;
  kur_tarihi: string;
  son_guncelleme: string;
  durum: number;
}

export async function getGuncelKurlar(): Promise<DovizKur[]> {
  const response = await fetch(`${API_URL}/doviz-kur/guncel`);

  if (!response.ok) {
    throw new Error('Güncel kurlar getirilemedi');
  }

  return response.json();
}

export async function cevirParaBirimi(
  miktar: number,
  kaynakBirim: string,
  hedefBirim: string
): Promise<{ cevrilen_miktar: number; kur: number }> {
  const params = new URLSearchParams({
    miktar: miktar.toString(),
    kaynak: kaynakBirim,
    hedef: hedefBirim,
  });

  const response = await fetch(`${API_URL}/doviz-kur/cevir?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Para birimi çevrilemedi');
  }

  return response.json();
}

// Fiyat gösterimi için helper fonksiyon
export function formatPrice(
  miktar: number,
  paraBirimi: string = 'TRY'
): string {
  const paraSembol: { [key: string]: string } = {
    TRY: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CHF: '₣',
    RUB: '₽',
  };

  const sembol = paraSembol[paraBirimi.toUpperCase()] || paraBirimi;
  const formattedMiktar = miktar.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formattedMiktar} ${sembol}`;
}

