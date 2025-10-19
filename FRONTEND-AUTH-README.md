# Mamon Site - Frontend Authentication

## 🎉 Kurulum Tamamlandı!

Mamon Travel sitesinde müşteri kayıt ve giriş sistemi başarıyla entegre edildi.

## 📁 Oluşturulan Dosyalar

### Services
- `src/services/authService.ts` - API servis dosyası

### Contexts
- `src/contexts/AuthContext.tsx` - Authentication context ve hooks

### Components
- `src/components/UserMenu.tsx` - Kullanıcı menüsü komponenti

### Pages (Güncellendi)
- `src/app/(auth)/signup/page.tsx` - Kayıt sayfası (API'ye bağlandı)
- `src/app/(auth)/login/page.tsx` - Giriş sayfası (API'ye bağlandı)
- `src/app/layout.tsx` - AuthProvider eklendi

## 🚀 Kullanım

### 1. API URL'ini Ayarlama

`.env.local` dosyası oluşturun:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Next.js Dev Server'ı Başlatın
```bash
cd mamon-site
npm run dev
```

### 3. Test Edin

**Kayıt Sayfası:** http://localhost:3001/signup
**Giriş Sayfası:** http://localhost:3001/login

## 💻 Kod Örnekleri

### useAuth Hook Kullanımı

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Lütfen giriş yapın</div>;
  }

  return (
    <div>
      <h1>Hoşgeldin {user?.ad}!</h1>
      <button onClick={logout}>Çıkış Yap</button>
    </div>
  );
}
```

### Protected Route Oluşturma

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <div>Protected Content</div>;
}
```

### Manual API Call

```typescript
import authService from '@/services/authService';

// Kayıt
const handleRegister = async () => {
  try {
    const response = await authService.register({
      ad: 'Barış',
      soyad: 'Gül',
      email: 'baris@test.com',
      kullanici_adi: 'barisgul',
      sifre: '123456',
    });
    
    authService.saveAuth(response.access_token, response.kullanici);
    console.log('Kayıt başarılı', response.kullanici);
  } catch (error) {
    console.error('Kayıt hatası:', error);
  }
};

// Giriş
const handleLogin = async () => {
  try {
    const response = await authService.login({
      kullanici_adi: 'barisgul',
      sifre: '123456',
    });
    
    authService.saveAuth(response.access_token, response.kullanici);
    console.log('Giriş başarılı', response.kullanici);
  } catch (error) {
    console.error('Giriş hatası:', error);
  }
};

// Profil Getir
const getProfile = async () => {
  const token = authService.getToken();
  if (!token) return;

  try {
    const user = await authService.getProfile(token);
    console.log('Kullanıcı profili:', user);
  } catch (error) {
    console.error('Profil hatası:', error);
  }
};

// Çıkış
const handleLogout = () => {
  authService.logout();
  console.log('Çıkış yapıldı');
};
```

## 🎨 UserMenu Komponenti

Header'a kullanıcı menüsü eklemek için:

```typescript
import UserMenu from '@/components/UserMenu';

export default function Header() {
  return (
    <header>
      {/* Diğer header içeriği */}
      <UserMenu />
    </header>
  );
}
```

## 📊 AuthContext API

### Properties
- `user: User | null` - Mevcut kullanıcı
- `loading: boolean` - Yükleniyor durumu
- `isAuthenticated: boolean` - Giriş yapılmış mı?

### Methods
- `login(data: LoginData): Promise<void>` - Giriş yap
- `register(data: RegisterData): Promise<void>` - Kayıt ol
- `logout(): void` - Çıkış yap

## 🔒 Güvenlik

- Token'lar `localStorage`'da saklanır
- Şifreler minimum 6 karakter
- API endpoint'leri CORS korumalı
- Token'lar Bearer Authentication ile gönderilir

## 🎯 Özellikler

✅ Müşteri kaydı  
✅ Müşteri girişi  
✅ Otomatik yönlendirme (giriş sonrası anasayfa)  
✅ Token yönetimi (localStorage)  
✅ Kullanıcı profil yönetimi  
✅ Context-based state management  
✅ Protected routes desteği  
✅ Form validasyonu  
✅ Hata yönetimi  
✅ Loading states  
✅ Responsive kullanıcı menüsü  

## 🔄 Sonraki Adımlar

- [ ] Profil sayfası oluştur
- [ ] Şifre değiştirme sayfası
- [ ] Email doğrulama
- [ ] Şifremi unuttum fonksiyonu
- [ ] Social login entegrasyonu
- [ ] Refresh token mekanizması
- [ ] Protected routes middleware
- [ ] Loading skeletons

## 🐛 Sorun Giderme

### API bağlantı hatası
- Backend'in çalıştığından emin olun: `http://localhost:3000`
- `.env.local` dosyasında `NEXT_PUBLIC_API_URL` ayarlandığından emin olun
- CORS ayarlarını kontrol edin

### "useAuth must be used within an AuthProvider" hatası
- Component'in `AuthProvider` içinde olduğundan emin olun
- `layout.tsx` dosyasında `AuthProvider` eklendiğinden emin olun

### Token geçersiz hatası
- Token süresinin dolmadığından emin olun (7 gün)
- localStorage'dan token'ı kontrol edin
- Çıkış yapıp tekrar giriş yapın

## 📱 Responsive Tasarım

Tüm sayfalar mobil uyumlu olarak tasarlanmıştır:
- ✅ Mobil menü
- ✅ Responsive formlar
- ✅ Touch-friendly butonlar

## 🎨 Dark Mode

Dark mode desteği mevcuttur:
- ✅ Tüm auth sayfaları
- ✅ UserMenu komponenti
- ✅ Hata mesajları

---

**Geliştirici:** Barış Gül  
**Tarih:** 19 Ekim 2025  
**Frontend Stack:** Next.js 14, React, TypeScript, Tailwind CSS


