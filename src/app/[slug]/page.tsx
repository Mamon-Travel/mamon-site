'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getDinamikSayfaWithOteller,
  DinamikSayfaWithOteller,
} from '@/services/dinamik-sayfalar.service';
import Loading from '@/components/loading/Loading';

export default function DinamikSayfaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [data, setData] = useState<DinamikSayfaWithOteller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDinamikSayfaWithOteller(slug);
      setData(result);
    } catch (err) {
      setError('Sayfa yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sayfa Bulunamadı</h1>
          <p className="text-gray-600 mb-6">
            Aradığınız sayfa bulunamadı veya yüklenemedi.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const { sayfa, oteller } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {sayfa.kapak_gorseli && (
        <div
          className="h-64 md:h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${sayfa.kapak_gorseli})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{sayfa.baslik}</h1>
              {sayfa.aciklama && (
                <p className="text-lg md:text-xl">{sayfa.aciklama}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Başlık (eğer görsel yoksa) */}
        {!sayfa.kapak_gorseli && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{sayfa.baslik}</h1>
            {sayfa.aciklama && (
              <p className="text-lg text-gray-600">{sayfa.aciklama}</p>
            )}
          </div>
        )}

        {/* Üst İçerik */}
        {sayfa.ust_icerik && (
          <div
            className="prose max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: sayfa.ust_icerik }}
          />
        )}

        {/* Filtre Bilgisi */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Arama Kriterleri</h2>
          <div className="flex flex-wrap gap-3">
            {sayfa.filtre_kriterleri.bolgeler &&
              sayfa.filtre_kriterleri.bolgeler.length > 0 && (
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="font-medium">Bölgeler:</span>{' '}
                  {sayfa.filtre_kriterleri.bolgeler.join(', ')}
                </div>
              )}
            {sayfa.filtre_kriterleri.yildiz &&
              sayfa.filtre_kriterleri.yildiz.length > 0 && (
                <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                  <span className="font-medium">Yıldız:</span>{' '}
                  {sayfa.filtre_kriterleri.yildiz.join(', ')} ⭐
                </div>
              )}
            {sayfa.filtre_kriterleri.konseptler &&
              sayfa.filtre_kriterleri.konseptler.length > 0 && (
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <span className="font-medium">Konsept:</span>{' '}
                  {sayfa.filtre_kriterleri.konseptler.join(', ')}
                </div>
              )}
            {sayfa.filtre_kriterleri.min_fiyat && (
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <span className="font-medium">Min Fiyat:</span>{' '}
                {sayfa.filtre_kriterleri.min_fiyat} ₺
              </div>
            )}
            {sayfa.filtre_kriterleri.max_fiyat && (
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <span className="font-medium">Max Fiyat:</span>{' '}
                {sayfa.filtre_kriterleri.max_fiyat} ₺
              </div>
            )}
          </div>
        </div>

        {/* Oteller Listesi */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {oteller.length} Otel Bulundu
          </h2>

          {oteller.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-600">
                Belirtilen kriterlere uygun otel bulunamadı.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {oteller.map((otel: any) => (
                <div
                  key={otel.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/otel/${otel.slug}`)}
                >
                  {otel.kapak_gorseli && (
                    <img
                      src={otel.kapak_gorseli}
                      alt={otel.ad}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{otel.ad}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500">
                        {'⭐'.repeat(otel.yildiz)}
                      </span>
                      {otel.konsept && (
                        <span className="text-sm text-gray-600">
                          • {otel.konsept}
                        </span>
                      )}
                    </div>
                    {otel.sehir && (
                      <p className="text-sm text-gray-500 mb-3">
                        📍 {otel.sehir}
                        {otel.bolge && `, ${otel.bolge}`}
                      </p>
                    )}
                    {otel.min_fiyat && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Başlangıç fiyatı</span>
                        <span className="text-xl font-bold text-green-600">
                          {Number(otel.min_fiyat).toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alt İçerik */}
        {sayfa.alt_icerik && (
          <div
            className="prose max-w-none bg-white rounded-lg shadow-sm p-8"
            dangerouslySetInnerHTML={{ __html: sayfa.alt_icerik }}
          />
        )}
      </div>
    </div>
  );
}

