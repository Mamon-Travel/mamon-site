'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import reservationService, { Reservation } from '@/services/reservationService';
import ButtonPrimary from '@/shared/ButtonPrimary';

const AccountBookingsPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadReservations();
    }
  }, [isAuthenticated]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error: any) {
      console.error('Rezervasyonlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (durum: string) => {
    const styles: Record<string, string> = {
      beklemede: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      onaylandi: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      iptal_edildi: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      tamamlandi: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    
    const labels: Record<string, string> = {
      beklemede: 'Beklemede',
      onaylandi: 'Onaylandı',
      iptal_edildi: 'İptal Edildi',
      tamamlandi: 'Tamamlandı',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[durum] || ''}`}>
        {labels[durum] || durum}
      </span>
    );
  };

  const getPaymentStatusBadge = (odemeDurumu: string) => {
    const styles: Record<string, string> = {
      bekleniyor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      odendi: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      iade_edildi: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    
    const labels: Record<string, string> = {
      bekleniyor: 'Ödeme Bekleniyor',
      odendi: 'Ödendi',
      iade_edildi: 'İade Edildi',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[odemeDurumu] || ''}`}>
        {labels[odemeDurumu] || odemeDurumu}
      </span>
    );
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

  if (reservations.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-4">Rezervasyonlarım</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Henüz rezervasyonunuz bulunmamaktadır.
          </p>
          <ButtonPrimary onClick={() => router.push('/')}>
            Rezervasyon Yap
          </ButtonPrimary>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold">Rezervasyonlarım</h2>
      </div>

      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Rezervasyon No: {reservation.rezervasyon_no}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {new Date(reservation.olusturma_tarihi).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(reservation.durum)}
                {getPaymentStatusBadge(reservation.odeme_durumu)}
              </div>
            </div>

            {reservation.detaylar && reservation.detaylar.length > 0 && (
              <div className="mb-4 space-y-2">
                {reservation.detaylar.map((detay: any, index: number) => (
                  <div
                    key={index}
                    className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{detay.urun_adi}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {detay.hizmet_adi}
                        </p>
                        {detay.rezervasyon_bilgileri && (
                          <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-2">
                            {detay.rezervasyon_bilgileri.giris_tarihi && (
                              <span className="mr-4">
                                📅 {detay.rezervasyon_bilgileri.giris_tarihi}
                              </span>
                            )}
                            {detay.rezervasyon_bilgileri.cikis_tarihi && (
                              <span>
                                → {detay.rezervasyon_bilgileri.cikis_tarihi}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {detay.miktar} x {detay.birim_fiyat} {reservation.para_birimi}
                        </p>
                        <p className="font-semibold">
                          {detay.toplam_fiyat} {reservation.para_birimi}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div>
                {reservation.odeme_yontemi && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Ödeme: {reservation.odeme_yontemi}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Toplam</p>
                <p className="text-2xl font-bold text-primary-600">
                  {reservation.toplam_tutar} {reservation.para_birimi}
                </p>
              </div>
            </div>

            {reservation.not && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Not:</strong> {reservation.not}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountBookingsPage;


