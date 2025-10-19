const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface UpdateProfileData {
  ad?: string;
  soyad?: string;
  email?: string;
  telefon?: string;
  resim?: string;
  mevcutSifre?: string;
  yeniSifre?: string;
}

export interface ProfileResponse {
  id: number;
  ad: string;
  soyad: string;
  email: string;
  kullanici_adi: string;
  telefon?: string;
  resim?: string;
  kullanici_tipi: string;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

class UserService {
  async getProfile(token: string): Promise<ProfileResponse> {
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profil bilgisi alınamadı');
    }

    return response.json();
  }

  async updateProfile(
    token: string,
    data: UpdateProfileData,
  ): Promise<ProfileResponse> {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profil güncellenemedi');
    }

    return response.json();
  }
}

export default new UserService();

