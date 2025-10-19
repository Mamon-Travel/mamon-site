import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Product {
  id: number;
  hizmet_id: number;
  baslik: string;
  slug: string;
  aciklama: string;
  ana_resim: string;
  resimler: string[];
  fiyat: number;
  fiyat_birimi: string;
  fiyat_tipi: string;
  stok_durumu: string;
  ozellikler: any;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  hizmet?: {
    id: number;
    ad: string;
    slug: string;
  };
}

class ProductService {
  // Tüm ürünleri getir
  async getAll(): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/urunler`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ürünler yüklenemedi');
    }
  }

  // Hizmete göre ürünleri getir
  async getByHizmet(hizmetId: number): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/urunler/hizmet/${hizmetId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ürünler yüklenemedi');
    }
  }

  // Tek ürün detayı (ID ile)
  async getById(id: number): Promise<Product> {
    try {
      const response = await axios.get(`${API_URL}/urunler/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ürün bulunamadı');
    }
  }

  // Tek ürün detayı (Slug ile)
  async getBySlug(slug: string): Promise<Product> {
    try {
      const response = await axios.get(`${API_URL}/urunler/slug/${slug}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ürün bulunamadı');
    }
  }
}

export default new ProductService();

