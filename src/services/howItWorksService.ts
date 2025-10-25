import { API_URL } from './api.config';
import HIW1img from '@/images/HIW1.png'
import HIW2img from '@/images/HIW2.png'
import HIW3img from '@/images/HIW3.png'

export interface HowItWorksStep {
  id: number;
  sayfa: string;
  baslik: string;
  aciklama?: string;
  gorsel_url?: string;
  gorsel_url_dark?: string;
  sira: number;
  durum: number;
}

// Ana sayfa adımlarını getir
export async function getAnasayfaAdimlar(): Promise<HowItWorksStep[]> {
  try {
    const response = await fetch(`${API_URL}/nasil-calisir/sayfa/anasayfa`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Nasıl çalışır adımları yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('How it works fetch error:', error);
    // Fallback data
    return [
      {
        id: 1,
        sayfa: 'anasayfa',
        baslik: 'Book & relax',
        aciklama: 'Let each trip be an inspirational journey, each room a peaceful space',
        gorsel_url: HIW1img.src,
        sira: 1,
        durum: 1,
      },
      {
        id: 2,
        sayfa: 'anasayfa',
        baslik: 'Smart checklist',
        aciklama: 'Let each trip be an inspirational journey, each room a peaceful space',
        gorsel_url: HIW2img.src,
        sira: 2,
        durum: 1,
      },
      {
        id: 3,
        sayfa: 'anasayfa',
        baslik: 'Save more',
        aciklama: 'Let each trip be an inspirational journey, each room a peaceful space',
        gorsel_url: HIW3img.src,
        sira: 3,
        durum: 1,
      },
    ];
  }
}

const howItWorksService = {
  getAnasayfaAdimlar,
};

export default howItWorksService;

