'use client';

import { useState, useEffect } from 'react';
import { cevirParaBirimi, formatPrice } from '@/services/dovizService';

interface PriceConverterProps {
  fiyat: number;
  kaynakBirim?: string;
  gosterilecekBirimler?: string[];
  className?: string;
}

export default function PriceConverter({
  fiyat,
  kaynakBirim = 'TRY',
  gosterilecekBirimler = ['USD', 'EUR'],
  className = '',
}: PriceConverterProps) {
  const [cevriliMiktarlar, setCevriliMiktarlar] = useState<{
    [key: string]: number;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (kaynakBirim.toUpperCase() !== 'TRY') {
      cevir();
    }
  }, [fiyat, kaynakBirim, gosterilecekBirimler]);

  const cevir = async () => {
    setLoading(true);
    const yeniMiktarlar: { [key: string]: number } = {};

    for (const hedefBirim of gosterilecekBirimler) {
      if (hedefBirim.toUpperCase() === kaynakBirim.toUpperCase()) {
        yeniMiktarlar[hedefBirim] = fiyat;
        continue;
      }

      try {
        const result = await cevirParaBirimi(fiyat, kaynakBirim, hedefBirim);
        yeniMiktarlar[hedefBirim] = result.cevrilen_miktar;
      } catch (error) {
        console.error(`${hedefBirim} çevrimi başarısız:`, error);
      }
    }

    setCevriliMiktarlar(yeniMiktarlar);
    setLoading(false);
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Ana Fiyat */}
      <span className="text-2xl font-bold text-gray-900">
        {formatPrice(fiyat, kaynakBirim)}
      </span>

      {/* Çevrilmiş Fiyatlar */}
      {!loading && Object.keys(cevriliMiktarlar).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(cevriliMiktarlar).map(([birim, miktar]) => (
            <span
              key={birim}
              className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded"
            >
              ≈ {formatPrice(miktar, birim)}
            </span>
          ))}
        </div>
      )}

      {loading && (
        <span className="text-sm text-gray-400 animate-pulse">
          Çevriliyor...
        </span>
      )}
    </div>
  );
}

