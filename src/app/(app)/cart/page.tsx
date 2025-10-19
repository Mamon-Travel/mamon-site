'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import ButtonPrimary from '@/shared/ButtonPrimary';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

const CartPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cart, cartTotal, loading, updateCartItem, removeFromCart } = useCart();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(id, newQuantity);
      toast.success('Miktar güncellendi');
    } catch (error: any) {
      toast.error('Hata!', {
        description: error.message || 'Güncelleme başarısız',
      });
    }
  };

  const handleRemove = async (id: number) => {
    toast.promise(
      removeFromCart(id),
      {
        loading: 'Siliniyor...',
        success: 'Ürün sepetten kaldırıldı',
        error: (error: any) => error.message || 'Silme başarısız',
      }
    );
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (authLoading || loading) {
    return (
      <div className="container py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-4">Sepetiniz Boş</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Sepetinizde henüz ürün bulunmamaktadır.
          </p>
          <ButtonPrimary onClick={() => router.push('/')}>
            Alışverişe Başla
          </ButtonPrimary>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Sepetim</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sepet Öğeleri */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex gap-4">
                  {/* Ürün Resmi */}
                  {item.urun?.ana_resim && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.urun.ana_resim}
                        alt={item.urun.baslik}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Ürün Bilgileri */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-1">
                      {item.urun?.baslik || 'Ürün'}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                      Birim Fiyat: {item.birimFiyat} {item.urun?.fiyat_birimi || 'TRY'}
                    </p>

                    {/* Rezervasyon Bilgileri */}
                    {item.rezervasyonBilgileri && (
                      <div className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
                        {item.rezervasyonBilgileri.giris_tarihi && (
                          <p>📅 Giriş: {item.rezervasyonBilgileri.giris_tarihi}</p>
                        )}
                        {item.rezervasyonBilgileri.cikis_tarihi && (
                          <p>📅 Çıkış: {item.rezervasyonBilgileri.cikis_tarihi}</p>
                        )}
                        {item.rezervasyonBilgileri.misafir_sayisi && (
                          <p>👥 Misafir: {item.rezervasyonBilgileri.misafir_sayisi}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Miktar ve Fiyat */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.miktar - 1)}
                        className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{item.miktar}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.miktar + 1)}
                        className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold text-lg">
                      {item.toplamFiyat} {item.urun?.fiyat_birimi || 'TRY'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Özet */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Ürün Sayısı</span>
                  <span>{cartTotal?.adetSayisi || 0}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Ara Toplam</span>
                  <span>{cartTotal?.toplamTutar || 0} TRY</span>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span>
                    <span>{cartTotal?.toplamTutar || 0} TRY</span>
                  </div>
                </div>
              </div>

              <ButtonPrimary
                onClick={handleCheckout}
                className="w-full"
                disabled={!cartTotal || cartTotal.adetSayisi === 0}
              >
                Ödemeye Geç
              </ButtonPrimary>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-4">
                Güvenli ödeme ile devam edin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

