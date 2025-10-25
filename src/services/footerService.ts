import { API_URL } from './api.config';

export interface FooterData {
  menuler: {
    solutions: Array<{ name: string; href: string }>;
    support: Array<{ name: string; href: string }>;
    company: Array<{ name: string; href: string }>;
    legal: Array<{ name: string; href: string }>;
  };
  ayarlar: {
    about_text: string;
    copyright: string;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    github_url: string;
    youtube_url: string;
  };
}

export async function getFooterData(): Promise<FooterData> {
  try {
    const response = await fetch(`${API_URL}/footer/full`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Footer verisi yüklenemedi');
    }

    const data = await response.json();
    
    // Backend formatını frontend formatına çevir
    const menuler = {
      solutions: (data.menuler.solutions || []).map((m: any) => ({ name: m.baslik, href: m.url })),
      support: (data.menuler.support || []).map((m: any) => ({ name: m.baslik, href: m.url })),
      company: (data.menuler.company || []).map((m: any) => ({ name: m.baslik, href: m.url })),
      legal: (data.menuler.legal || []).map((m: any) => ({ name: m.baslik, href: m.url })),
    };

    return {
      menuler,
      ayarlar: data.ayarlar,
    };
  } catch (error) {
    console.error('Footer fetch error:', error);
    // Fallback data
    return {
      menuler: {
        solutions: [
          { name: 'Marketing', href: '#' },
          { name: 'Analytics', href: '#' },
          { name: 'Automation', href: '#' },
          { name: 'Commerce', href: '#' },
        ],
        support: [
          { name: 'Submit ticket', href: '#' },
          { name: 'Documentation', href: '#' },
          { name: 'Guides', href: '#' },
        ],
        company: [
          { name: 'About', href: '#' },
          { name: 'Blog', href: '#' },
          { name: 'Jobs', href: '#' },
          { name: 'Press', href: '#' },
        ],
        legal: [
          { name: 'Terms of service', href: '#' },
          { name: 'Privacy policy', href: '#' },
          { name: 'License', href: '#' },
          { name: 'Insights', href: '#' },
        ],
      },
      ayarlar: {
        about_text: 'Making the world a better place through constructing elegant hierarchies.',
        copyright: '© 2025 Your Company, Inc. All rights reserved.',
        facebook_url: '#',
        instagram_url: '#',
        twitter_url: '#',
        github_url: '#',
        youtube_url: '#',
      },
    };
  }
}

const footerService = {
  getFooterData,
};

export default footerService;

