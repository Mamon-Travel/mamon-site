const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface RegisterData {
  ad: string;
  soyad: string;
  email: string;
  kullanici_adi: string;
  sifre: string;
  telefon?: string;
}

export interface LoginData {
  kullanici_adi: string;
  sifre: string;
}

export interface User {
  id: number;
  ad: string;
  soyad: string;
  email: string;
  kullanici_adi: string;
  telefon?: string;
  resim?: string;
  kullanici_tipi: string;
  durum: number;
}

export interface AuthResponse {
  kullanici: User;
  access_token: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Kayıt başarısız');
    }

    return response.json();
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Giriş başarısız');
    }

    return response.json();
  }

  async getProfile(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Profil bilgisi alınamadı');
    }

    return response.json();
  }

  saveAuth(token: string, user: User) {
    if (typeof window !== 'undefined') {
      // sessionStorage kullan - tarayıcı kapanınca silinir
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = sessionStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  logout() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();


