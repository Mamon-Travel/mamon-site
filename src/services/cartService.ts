import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface CartItem {
  id: number;
  kullaniciId: number;
  urunId: number;
  miktar: number;
  birimFiyat: number;
  toplamFiyat: number;
  rezervasyonBilgileri: any;
  olusturmaTarihi: string;
  guncellemeTarihi: string;
  urun?: any;
}

export interface CartTotal {
  adetSayisi: number;
  toplamTutar: number;
  sepetItems: CartItem[];
}

class CartService {
  private getAuthHeader() {
    const token = sessionStorage.getItem('token'); // localStorage yerine sessionStorage
    if (!token) {
      throw new Error('Unauthorized');
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // Sepete ürün ekle
  async addToCart(data: {
    urunId: number;
    miktar: number;
    rezervasyonBilgileri?: any;
  }): Promise<CartItem> {
    try {
      const response = await axios.post(
        `${API_URL}/sepet`,
        data,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Sepeti getir
  async getCart(): Promise<CartItem[]> {
    try {
      const response = await axios.get(`${API_URL}/sepet`, this.getAuthHeader());
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Sepet toplamını getir
  async getCartTotal(): Promise<CartTotal> {
    try {
      const response = await axios.get(
        `${API_URL}/sepet/toplam`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sepet toplamı alınamadı');
    }
  }

  // Sepet öğesini güncelle
  async updateCartItem(
    id: number,
    data: { miktar?: number; rezervasyonBilgileri?: any }
  ): Promise<CartItem> {
    try {
      const response = await axios.patch(
        `${API_URL}/sepet/${id}`,
        data,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Güncelleme başarısız');
    }
  }

  // Sepetten ürün sil
  async removeFromCart(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/sepet/${id}`, this.getAuthHeader());
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Silme başarısız');
    }
  }

  // Sepeti temizle
  async clearCart(): Promise<void> {
    try {
      await axios.delete(`${API_URL}/sepet`, this.getAuthHeader());
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sepet temizlenemedi');
    }
  }
}

export default new CartService();

