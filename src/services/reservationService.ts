import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Reservation {
  id: number;
  kullanici_id: number;
  rezervasyon_no: string;
  toplam_tutar: number;
  para_birimi: string;
  durum: string;
  odeme_durumu: string;
  odeme_yontemi?: string;
  not?: string;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  detaylar?: any[];
}

class ReservationService {
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

  // Kullanıcının rezervasyonlarını getir
  async getMyReservations(): Promise<Reservation[]> {
    try {
      const response = await axios.get(
        `${API_URL}/rezervasyonlar/benim`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Rezervasyonlar yüklenemedi');
    }
  }

  // Rezervasyon detayı
  async getById(id: number): Promise<Reservation> {
    try {
      const response = await axios.get(
        `${API_URL}/rezervasyonlar/${id}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Rezervasyon bulunamadı');
    }
  }

  // Rezervasyon numarası ile getir
  async getByReservationNo(rezervasyonNo: string): Promise<Reservation> {
    try {
      const response = await axios.get(
        `${API_URL}/rezervasyonlar/no/${rezervasyonNo}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Rezervasyon bulunamadı');
    }
  }
}

export default new ReservationService();

