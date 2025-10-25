import { API_URL } from './api.config';

export interface Category {
  id: number;
  hizmet_id: number;
  ad: string;
  slug: string;
  bolge?: string;
  adet: number;
  aciklama?: string;
  thumbnail?: string;
  kapak_gorseli?: string;
  sira: number;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  hizmet?: {
    id: number;
    ad: string;
    slug: string;
  };
}

// Frontend için formatlı kategori
export interface FormattedCategory {
  id: string;
  name: string;
  handle: string;
  href: string;
  region?: string;
  count: number;
  description?: string;
  thumbnail?: string;
  coverImage?: {
    src: string;
    width: number;
    height: number;
  };
}

const categoryService = {
  // Tüm kategorileri getir
  async getAll(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/kategoriler`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Kategoriler yüklenemedi');
    }
    return response.json();
  },

  // Hizmete göre kategorileri getir
  async getByHizmetId(hizmetId: number): Promise<Category[]> {
    const response = await fetch(`${API_URL}/kategoriler/hizmet/${hizmetId}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Kategoriler yüklenemedi');
    }
    return response.json();
  },

  // Hizmet slug'ına göre kategorileri getir
  async getByHizmetSlug(hizmetSlug: string): Promise<Category[]> {
    const response = await fetch(`${API_URL}/kategoriler/hizmet-slug/${hizmetSlug}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Kategoriler yüklenemedi');
    }
    return response.json();
  },

  // Slug'a göre kategori getir
  async getBySlug(slug: string, hizmetId?: number): Promise<Category> {
    const url = hizmetId 
      ? `${API_URL}/kategoriler/slug/${slug}?hizmetId=${hizmetId}`
      : `${API_URL}/kategoriler/slug/${slug}`;
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Kategori bulunamadı');
    }
    return response.json();
  },

  // Backend kategorisini frontend formatına çevir
  formatCategory(category: Category, hizmetSlug: string): FormattedCategory {
    return {
      id: `${hizmetSlug}://${category.id}`,
      name: category.ad,
      handle: category.slug,
      href: `/${hizmetSlug}-categories/${category.slug}`,
      region: category.bolge,
      count: category.adet,
      description: category.aciklama,
      thumbnail: category.thumbnail,
      coverImage: category.kapak_gorseli ? {
        src: category.kapak_gorseli,
        width: 1000,
        height: 800,
      } : undefined,
    };
  },
};

export default categoryService;

