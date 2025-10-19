'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import productService, { Product } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import ButtonPrimary from '@/shared/ButtonPrimary';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [params.slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getBySlug(params.slug as string);
      setProduct(data);
      setSelectedImage(data.ana_resim || '');
    } catch (error: any) {
      console.error('Ürün yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      toast.success('Ürün sepete eklendi! 🎉', {
        description: `${product.baslik} x${quantity}`,
      });
    } catch (error: any) {
      toast.error('Hata!', {
        description: error.message || 'Sepete eklenemedi',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-16">
        <div className="animate-pulse">
          <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-3xl mb-8" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3 mb-4" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full mb-2" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ürün bulunamadı</h2>
        <ButtonPrimary onClick={() => router.push('/')}>Ana Sayfaya Dön</ButtonPrimary>
      </div>
    );
  }

  const allImages = [
    product.ana_resim,
    ...(product.resimler || []),
  ].filter(Boolean);

  return (
    <div className="container py-8 lg:py-16">
      {/* Geri Butonu */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-6 transition-colors"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Geri Dön</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Sol: Resimler */}
        <div>
          {/* Ana Resim */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4 bg-neutral-100 dark:bg-neutral-800">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.baslik}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-400">
                Resim yok
              </div>
            )}
            {product.stok_durumu === 'tukendi' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold">
                  Stokta Yok
                </span>
              </div>
            )}
          </div>

          {/* Küçük Resimler */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-primary-600 scale-105'
                      : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.baslik} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sağ: Detaylar */}
        <div>
          {/* Kategori Badge */}
          {product.hizmet && (
            <div className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
              {product.hizmet.ad}
            </div>
          )}

          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.baslik}</h1>

          {/* Fiyat */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
            <span className="text-4xl font-bold text-primary-600">
              {product.fiyat} {product.fiyat_birimi}
            </span>
            <span className="text-xl text-neutral-500">/ {product.fiyat_tipi}</span>
          </div>

          {/* Açıklama */}
          {product.aciklama && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Açıklama</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {product.aciklama}
              </p>
            </div>
          )}

          {/* Özellikler */}
          {product.ozellikler && Object.keys(product.ozellikler).length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Özellikler</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(product.ozellikler).map(([key, value]: [string, any]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl"
                  >
                    <span className="text-sm font-medium text-neutral-500 capitalize">
                      {key}:
                    </span>
                    <span className="text-sm font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Miktar ve Sepete Ekle */}
          {product.stok_durumu === 'mevcut' && (
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
              <div className="flex items-center gap-4 mb-6">
                <label className="text-lg font-semibold">Miktar:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-neutral-300 hover:border-primary-600 transition-colors font-semibold"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-neutral-300 hover:border-primary-600 transition-colors font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <ButtonPrimary
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full !py-4 !text-lg"
              >
                {addingToCart ? 'Ekleniyor...' : 'Sepete Ekle'}
              </ButtonPrimary>

              {!isAuthenticated && (
                <p className="text-sm text-neutral-500 mt-3 text-center">
                  Sepete eklemek için giriş yapmalısınız
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

