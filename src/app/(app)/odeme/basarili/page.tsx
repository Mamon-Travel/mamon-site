'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ButtonPrimary from '@/shared/ButtonPrimary';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const merchantOid = searchParams.get('merchant_oid');

  useEffect(() => {
    // Sepeti temizle (localStorage veya context)
    // CartContext otomatik olarak temizlenecek çünkü backend'de sepet temizlendi
  }, []);

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Ödeme Başarılı!
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-2">
            Rezervasyonunuz başarıyla oluşturuldu.
          </p>
          {merchantOid && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              İşlem No: {merchantOid}
            </p>
          )}
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 mb-8">
          <p className="text-neutral-700 dark:text-neutral-300">
            Rezervasyon detaylarınız e-posta adresinize gönderildi.
            Rezervasyonlarınızı hesabınızdan görüntüleyebilirsiniz.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonPrimary onClick={() => router.push('/account-bookings')}>
            Rezervasyonlarım
          </ButtonPrimary>
          <ButtonPrimary
            onClick={() => router.push('/')}
            className="bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100"
          >
            Ana Sayfa
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

