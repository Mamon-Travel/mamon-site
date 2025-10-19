import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface PaymentResponse {
  success: boolean;
  odemeId: number;
  merchantOid: string;
  paymentUrl: string;
  token: string;
}

export interface Payment {
  id: number;
  rezervasyonId: number;
  kullaniciId: number;
  merchantOid: string;
  tutar: number;
  paraBirimi: string;
  durum: string;
  odemeYontemi: string;
  olusturmaTarihi: string;
  odemeTarihi?: string;
}

class PaymentService {
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

  // Ödeme başlat
  async startPayment(data: {
    kaynak: 'sepet' | 'rezervasyon';
    rezervasyonId?: number;
    tutar?: number;
    taksitSayisi?: number;
  }): Promise<PaymentResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/odeme/basla`,
        data,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ödeme başlatılamadı');
    }
  }

  // Kullanıcının ödemelerini getir
  async getMyPayments(): Promise<Payment[]> {
    try {
      const response = await axios.get(
        `${API_URL}/odeme/benim`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ödemeler yüklenemedi');
    }
  }

  // Ödeme detayı
  async getPaymentById(id: number): Promise<Payment> {
    try {
      const response = await axios.get(
        `${API_URL}/odeme/${id}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ödeme bulunamadı');
    }
  }

  // Merchant OID ile ödeme getir
  async getPaymentByMerchantOid(merchantOid: string): Promise<Payment> {
    try {
      const response = await axios.get(
        `${API_URL}/odeme/merchant/${merchantOid}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ödeme bulunamadı');
    }
  }
}

export default new PaymentService();

