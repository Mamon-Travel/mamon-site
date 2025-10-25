import { API_URL } from './api.config';

export interface SiteFeature {
  id: number;
  sayfa: string;
  rozet: string;
  rozet_renk: string;
  baslik: string;
  aciklama?: string;
  sira: number;
  durum: number;
}

// Ana sayfa özellikleri getir
export async function getAnasayfaOzellikleri(): Promise<SiteFeature[]> {
  try {
    const response = await fetch(`${API_URL}/site-ozellikleri/sayfa/anasayfa`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Site özellikleri yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Site özellik fetch error:', error);
    // Fallback data
    return [
      {
        id: 1,
        sayfa: 'anasayfa',
        rozet: 'Advertising',
        rozet_renk: 'blue',
        baslik: 'Cost-effective advertising',
        aciklama: 'With a free listing, you can advertise your rental with no upfront costs',
        sira: 1,
        durum: 1,
      },
      {
        id: 2,
        sayfa: 'anasayfa',
        rozet: 'Exposure',
        rozet_renk: 'green',
        baslik: 'Reach millions with Chisfis',
        aciklama: 'Millions of people are searching for unique places to stay around the world',
        sira: 2,
        durum: 1,
      },
      {
        id: 3,
        sayfa: 'anasayfa',
        rozet: 'Secure',
        rozet_renk: 'red',
        baslik: 'Secure and simple',
        aciklama: 'A Holiday Lettings listing gives you a secure and easy way to take bookings and payments online',
        sira: 3,
        durum: 1,
      },
    ];
  }
}

const siteFeatureService = {
  getAnasayfaOzellikleri,
};

export default siteFeatureService;

