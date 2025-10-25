'use client'

import React, { useEffect, useState } from 'react';
import productService, { Product } from '@/services/productService';
import { getAktifOteller, Otel } from '@/services/otelService';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

const SectionGridProducts = ({ hizmetId }: { hizmetId?: number }) => {
  const { T } = useLanguage();
  const isKonaklama = hizmetId === 1; // hizmetId 1 = konaklama
  
  const [products, setProducts] = useState<Product[]>([]);
  const [oteller, setOteller] = useState<Otel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (isKonaklama) {
          // Konaklama için otelleri yükle
          const otelData = await getAktifOteller();
          setOteller(otelData.slice(0, 8)); // İlk 8 oteli göster
        } else {
          // Diğer hizmetler için ürünleri yükle
          const data = hizmetId
            ? await productService.getByHizmet(hizmetId)
            : await productService.getAll();
          setProducts(data.slice(0, 8)); // İlk 8 ürünü göster
        }
      } catch (error: any) {
        console.error('Veri yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [hizmetId, isKonaklama]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 dark:text-neutral-400">
          {T.common?.loading || 'Yükleniyor...'}
        </p>
      </div>
    );
  }

  if (isKonaklama && oteller.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 dark:text-neutral-400">
          {T.products?.no_hotels || 'Henüz otel bulunmamaktadır.'}
        </p>
      </div>
    );
  }

  if (!isKonaklama && products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 dark:text-neutral-400">
          {T.products?.no_products || 'Henüz ürün bulunmamaktadır.'}
        </p>
      </div>
    );
  }

  // Konaklama için otelleri göster
  if (isKonaklama) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {oteller.map((otel) => {
          const otelUrl = `/stay-listings/${otel.slug}`;
          
          return (
            <Link
              key={otel.id}
              href={otelUrl}
              className="group cursor-pointer block"
            >
              <div className="relative overflow-hidden rounded-2xl">
                {otel.kapak_gorseli ? (
                  <Image
                    src={otel.kapak_gorseli}
                    alt={otel.ad}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                    <span className="text-neutral-400">{T.common?.no_image || 'Resim yok'}</span>
                  </div>
                )}
                {otel.durum === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {T.common?.inactive || 'Pasif'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {otel.ad}
                </h3>
                
                <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                  {otel.yildiz && (
                    <span className="flex items-center gap-1">
                      {'⭐'.repeat(otel.yildiz)}
                    </span>
                  )}
                  <span>{otel.sehir}{otel.bolge && `, ${otel.bolge}`}</span>
                </div>

                {otel.detay?.kisa_aciklama && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                    {otel.detay.kisa_aciklama}
                  </p>
                )}

                {otel.min_fiyat && (
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-2xl font-semibold text-primary-600">
                      ₺{otel.min_fiyat}
                    </span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      / {T.products?.per_night || 'gece'}
                    </span>
                  </div>
                )}

                {otel.otelOzellikleri && otel.otelOzellikleri.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {otel.otelOzellikleri.slice(0, 3).map((ozellik: any) => (
                      <span
                        key={ozellik.id}
                        className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center gap-1"
                      >
                        {ozellik.ikon && <span>{ozellik.ikon}</span>}
                        {ozellik.baslik}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  // Diğer hizmetler için ürünleri göster
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        // Hizmet slug'ına göre kategori belirle
        const categorySlug = product.hizmet?.slug || 'urun';
        const productUrl = `/${categorySlug}/${product.slug}`;
        
        return (
          <Link
            key={product.id}
            href={productUrl}
            className="group cursor-pointer block"
          >
          <div className="relative overflow-hidden rounded-2xl">
            {product.ana_resim ? (
              <Image
                src={product.ana_resim}
                alt={product.baslik}
                width={400}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <span className="text-neutral-400">{T.common?.no_image || 'Resim yok'}</span>
              </div>
            )}
            {product.stok_durumu === 'tukendi' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {T.products?.out_of_stock || 'Stokta Yok'}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3">
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.baslik}
            </h3>
            
            {product.aciklama && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                {product.aciklama}
              </p>
            )}

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-semibold text-primary-600">
                {product.fiyat} {product.fiyat_birimi}
              </span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                / {product.fiyat_tipi}
              </span>
            </div>

            {product.ozellikler && (
              <div className="flex flex-wrap gap-2 mt-3">
                {Object.entries(product.ozellikler).slice(0, 3).map(([key, value]: [string, any]) => (
                  <span
                    key={key}
                    className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full"
                  >
                    {value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
        );
      })}
    </div>
  );
};

export default SectionGridProducts;

