'use client';

import React, { useEffect, useState } from 'react';
import productService, { Product } from '@/services/productService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ButtonPrimary from '@/shared/ButtonPrimary';

const SectionGridProducts = ({ hizmetId }: { hizmetId?: number }) => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [hizmetId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = hizmetId
        ? await productService.getByHizmet(hizmetId)
        : await productService.getAll();
      setProducts(data.slice(0, 8)); // İlk 8 ürünü göster
    } catch (error: any) {
      console.error('Ürünler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-2xl h-80"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 dark:text-neutral-400">
          Henüz ürün bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        // Hizmet slug'ına göre kategori belirle
        const categorySlug = product.hizmet?.slug || 'urun';
        const productUrl = `/${categorySlug}/${product.slug}`;
        
        return (
          <div
            key={product.id}
            className="group cursor-pointer"
            onClick={() => router.push(productUrl)}
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
                <span className="text-neutral-400">Resim yok</span>
              </div>
            )}
            {product.stok_durumu === 'tukendi' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Stokta Yok
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
        </div>
        );
      })}
    </div>
  );
};

export default SectionGridProducts;

