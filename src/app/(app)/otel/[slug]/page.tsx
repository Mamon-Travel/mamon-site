'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOtelBySlug, Otel, OdaTipi } from '@/services/otelService';
import RezervasyonFormu from '@/components/RezervasyonFormu';
import { useLanguage } from '@/hooks/useLanguage';

export default function OtelDetayPage() {
  const params = useParams();
  const router = useRouter();
  const T = useLanguage();
  const slug = params.slug as string;

  const [otel, setOtel] = useState<Otel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOtel();
  }, [slug]);

  const loadOtel = async () => {
    try {
      setLoading(true);
      const data = await getOtelBySlug(slug);
      setOtel(data);
    } catch (error) {
      console.error('Otel yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRezervasyonTamamla = (rezervasyonData: any) => {
    console.log('Rezervasyon Verisi:', rezervasyonData);
    
    // Sepete ekle veya ödeme sayfasına yönlendir
    // localStorage.setItem('rezervasyon', JSON.stringify(rezervasyonData));
    // router.push('/checkout');
    
    alert('Rezervasyon bilgileri konsola yazdırıldı. Sepet entegrasyonu yapılacak.');
  };

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

  if (!otel) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {T.common?.not_found || 'Otel bulunamadı'}
        </h1>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {T.common?.back_home || 'Ana Sayfaya Dön'}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Otel Başlık */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold">{otel.ad}</h1>
          {otel.yildiz && (
            <div className="flex items-center">
              {Array.from({ length: otel.yildiz }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
          )}
        </div>
        
        {otel.konsept && (
          <p className="text-lg text-gray-600">{otel.konsept}</p>
        )}
        
        {(otel.sehir || otel.bolge) && (
          <p className="text-gray-500 mt-2">
            📍 {otel.bolge && `${otel.bolge}, `}{otel.sehir}
          </p>
        )}
      </div>

      {/* Kapak Görseli */}
      {otel.kapak_gorseli && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={otel.kapak_gorseli}
            alt={otel.ad}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}

      {/* İki Kolonlu Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon - Otel Bilgileri */}
        <div className="lg:col-span-2 space-y-8">
          {/* Kısa Açıklama */}
          {otel.detay?.kisa_aciklama && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {T.hotel?.about || 'Otel Hakkında'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {otel.detay.kisa_aciklama}
              </p>
            </div>
          )}

          {/* Uzun Açıklama */}
          {otel.detay?.uzun_aciklama && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {T.hotel?.details || 'Detaylar'}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {otel.detay.uzun_aciklama}
              </p>
            </div>
          )}

          {/* Mesafeler */}
          {(otel.detay?.denize_mesafe ||
            otel.detay?.havalimani_mesafe ||
            otel.detay?.sehir_merkezi_mesafe) && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">
                {T.hotel?.distances || 'Mesafeler'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {otel.detay.denize_mesafe && (
                  <div>
                    <p className="text-sm text-gray-600">🌊 Deniz</p>
                    <p className="font-medium">{otel.detay.denize_mesafe}</p>
                  </div>
                )}
                {otel.detay.havalimani_mesafe && (
                  <div>
                    <p className="text-sm text-gray-600">✈️ Havalimanı</p>
                    <p className="font-medium">{otel.detay.havalimani_mesafe}</p>
                  </div>
                )}
                {otel.detay.sehir_merkezi_mesafe && (
                  <div>
                    <p className="text-sm text-gray-600">🏙️ Şehir Merkezi</p>
                    <p className="font-medium">{otel.detay.sehir_merkezi_mesafe}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Oda Tipleri */}
          {otel.odaTipleri && otel.odaTipleri.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {T.hotel?.room_types || 'Oda Tipleri'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otel.odaTipleri
                  .filter((oda) => oda.durum === 1)
                  .map((oda) => (
                    <div
                      key={oda.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="font-bold text-lg mb-2">{oda.ad}</h3>
                      {oda.aciklama && (
                        <p className="text-sm text-gray-600 mb-3">{oda.aciklama}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                        {oda.yetiskin_kapasite && (
                          <span className="bg-blue-100 px-2 py-1 rounded">
                            👥 {oda.yetiskin_kapasite} Yetişkin
                          </span>
                        )}
                        {oda.cocuk_kapasite > 0 && (
                          <span className="bg-green-100 px-2 py-1 rounded">
                            👶 {oda.cocuk_kapasite} Çocuk
                          </span>
                        )}
                        {oda.metrekare && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            📐 {oda.metrekare}m²
                          </span>
                        )}
                        {oda.manzara && (
                          <span className="bg-purple-100 px-2 py-1 rounded">
                            🌅 {oda.manzara}
                          </span>
                        )}
                      </div>
                      {oda.fiyat && (
                        <p className="mt-3 text-xl font-bold text-blue-600">
                          {oda.fiyat.toLocaleString('tr-TR')} ₺
                          <span className="text-sm font-normal text-gray-500">
                            {' '}
                            / {T.hotel?.per_night || 'gecelik'}
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ Kolon - Rezervasyon Formu */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {otel.odaTipleri && otel.odaTipleri.length > 0 ? (
              <RezervasyonFormu
                odaTipleri={otel.odaTipleri}
                otelId={otel.id}
                onRezervasyonTamamla={handleRezervasyonTamamla}
              />
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <p className="text-gray-600">
                  {T.hotel?.no_rooms || 'Bu otel için henüz oda tipi tanımlanmamış'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

