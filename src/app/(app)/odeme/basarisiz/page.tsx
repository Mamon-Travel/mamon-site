'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ButtonPrimary from '@/shared/ButtonPrimary';
import { XCircleIcon } from '@heroicons/react/24/solid';

const PaymentFailurePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const merchantOid = searchParams.get('merchant_oid');

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <XCircleIcon className="w-24 h-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Ödeme Başarısız!
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-2">
            Ödeme işleminiz tamamlanamadı.
          </p>
          {merchantOid && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              İşlem No: {merchantOid}
            </p>
          )}
          {reason && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Hata: {reason}
            </p>
          )}
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 mb-8">
          <p className="text-neutral-700 dark:text-neutral-300 mb-4">
            Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.
          </p>
          <ul className="text-sm text-left text-neutral-600 dark:text-neutral-400 space-y-2">
            <li>• Kart bilgilerinizi kontrol edin</li>
            <li>• Kartınızda yeterli bakiye olduğundan emin olun</li>
            <li>• 3D Secure doğrulamasını tamamlayın</li>
            <li>• Farklı bir kart ile deneyebilirsiniz</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonPrimary onClick={() => router.push('/cart')}>
            Sepete Dön
          </ButtonPrimary>
          <ButtonPrimary
            onClick={() => router.push('/checkout')}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Tekrar Dene
          </ButtonPrimary>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-8">
          Sorun devam ederse lütfen müşteri hizmetlerimizle iletişime geçin.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailurePage;

