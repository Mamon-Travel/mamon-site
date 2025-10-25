'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllOteller, Otel } from '@/services/otelService';
import { useLanguage } from '@/hooks/useLanguage';

export default function OtellerPage() {
  const T = useLanguage();
  const [oteller, setOteller] = useState<Otel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSehir, setFilterSehir] = useState<string>('');

  useEffect(() => {
    loadOteller();
  }, []);

  const loadOteller = async () => {
    try {
      setLoading(true);
      const data = await getAllOteller();
      setOteller(data.filter((o) => o.durum === 1));
    } catch (error) {
      console.error('Oteller yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOteller = filterSehir
    ? oteller.filter((o) => o.sehir === filterSehir)
    : oteller;

  const sehirler = Array.from(new Set(oteller.map((o) => o.sehir).filter(Boolean)));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {T.common?.loading || 'Yükleniyor...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {T.hotels?.title || 'Oteller'}
        </h1>
        <p className="text-gray-600">
          {T.hotels?.subtitle || `${oteller.length} otel bulundu`}
        </p>
      </div>

      {/* Filtre */}
      {sehirler.length > 0 && (
        <div className="mb-6">
          <select
            value={filterSehir}
            onChange={(e) => setFilterSehir(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{T.hotels?.all_cities || 'Tüm Şehirler'}</option>
            {sehirler.map((sehir) => (
              <option key={sehir} value={sehir}>
                {sehir}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Otel Listesi */}
      {filteredOteller.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">
            {T.hotels?.no_hotels || 'Henüz otel bulunmuyor'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOteller.map((otel) => (
            <Link
              key={otel.id}
              href={`/otel/${otel.slug}`}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Otel Görseli */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                {otel.kapak_gorseli ? (
                  <img
                    src={otel.kapak_gorseli}
                    alt={otel.ad}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                    <span className="text-white text-4xl">🏨</span>
                  </div>
                )}
                
                {/* Yıldız Badge */}
                {otel.yildiz && (
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg">
                    <span className="text-yellow-400 font-bold">
                      {'★'.repeat(otel.yildiz)}
                    </span>
                  </div>
                )}
              </div>

              {/* Otel Bilgileri */}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {otel.ad}
                </h3>

                {otel.konsept && (
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {otel.konsept}
                  </p>
                )}

                {(otel.bolge || otel.sehir) && (
                  <p className="text-sm text-gray-600 mb-3">
                    📍 {otel.bolge && `${otel.bolge}, `}
                    {otel.sehir}
                  </p>
                )}

                {otel.detay?.kisa_aciklama && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {otel.detay.kisa_aciklama}
                  </p>
                )}

                {/* Fiyat */}
                {otel.min_fiyat && (
                  <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">
                        {T.hotels?.starting_from || 'Başlangıç fiyatı'}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {otel.min_fiyat.toLocaleString('tr-TR')} ₺
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      / {T.hotels?.per_night || 'gece'}
                    </span>
                  </div>
                )}

                {/* Özellikler */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {otel.detay?.oda_sayisi && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      🛏️ {otel.detay.oda_sayisi} Oda
                    </span>
                  )}
                  {otel.check_in_time && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      ⏰ Giriş: {otel.check_in_time}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

