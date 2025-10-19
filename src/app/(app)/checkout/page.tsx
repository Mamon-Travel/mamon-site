'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import paymentService from '@/services/paymentService';
import ButtonPrimary from '@/shared/ButtonPrimary';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { cartTotal, loading } = useCart();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [taksitSayisi, setTaksitSayisi] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!loading && (!cartTotal || cartTotal.adetSayisi === 0)) {
      router.push('/cart');
    }
  }, [cartTotal, loading, router]);

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      const response = await paymentService.startPayment({
        kaynak: 'sepet',
        taksitSayisi,
      });

      if (response.success && response.paymentUrl) {
        setPaymentUrl(response.paymentUrl);
        toast.success('Ödeme sayfasına yönlendiriliyorsunuz...');
      }
    } catch (error: any) {
      toast.error('Ödeme Hatası!', {
        description: error.message || 'Ödeme başlatılamadı',
      });
    } finally {
      setPaymentLoading(false);
    }
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

  if (paymentUrl) {
    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Ödeme Sayfası</h1>
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm">
            <iframe
              src={paymentUrl}
              id="paytriframe"
              frameBorder="0"
              scrolling="no"
              style={{ width: '100%', height: '800px' }}
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Ödeme</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kullanıcı Bilgileri */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold mb-4">Fatura Bilgileri</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Ad Soyad:</span>
                <p className="font-medium">{user?.ad} {user?.soyad}</p>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">E-posta:</span>
                <p className="font-medium">{user?.email}</p>
              </div>
              {user?.telefon && (
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Telefon:</span>
                  <p className="font-medium">{user.telefon}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Ürün Sayısı</span>
                <span className="font-medium">{cartTotal?.adetSayisi || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Ara Toplam</span>
                <span className="font-medium">{cartTotal?.toplamTutar || 0} TRY</span>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam</span>
                  <span>{cartTotal?.toplamTutar || 0} TRY</span>
                </div>
              </div>
            </div>

            {/* Taksit Seçimi */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Taksit Seçeneği
              </label>
              <select
                value={taksitSayisi}
                onChange={(e) => setTaksitSayisi(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              >
                <option value={1}>Tek Çekim</option>
                <option value={2}>2 Taksit</option>
                <option value={3}>3 Taksit</option>
                <option value={6}>6 Taksit</option>
                <option value={9}>9 Taksit</option>
                <option value={12}>12 Taksit</option>
              </select>
            </div>

            <ButtonPrimary
              onClick={handlePayment}
              loading={paymentLoading}
              className="w-full"
            >
              {paymentLoading ? 'Ödeme Hazırlanıyor...' : 'Ödeme Yap'}
            </ButtonPrimary>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-4">
              🔒 256-bit SSL ile güvenli ödeme
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

