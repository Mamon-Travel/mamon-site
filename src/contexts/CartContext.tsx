'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import cartService, { CartItem, CartTotal } from '@/services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  cartTotal: CartTotal | null;
  loading: boolean;
  addToCart: (urunId: number, miktar: number, rezervasyonBilgileri?: any) => Promise<void>;
  updateCartItem: (id: number, miktar: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<CartTotal | null>(null);
  const [loading, setLoading] = useState(false);

  // Sepeti yükle
  const loadCart = async () => {
    if (!isAuthenticated || !user) {
      setCart([]);
      setCartTotal(null);
      return;
    }

    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
      
      // Sepet toplamını hesapla (frontend'de hesapla, ekstra API call'a gerek yok)
      const total = cartData.reduce((sum, item) => sum + Number(item.toplamFiyat), 0);
      setCartTotal({
        adetSayisi: cartData.length,
        toplamTutar: total,
        sepetItems: cartData,
      });
    } catch (error: any) {
      // Unauthorized hatası sessizce ignore et (kullanıcı giriş yapmamış demektir)
      if (error.message !== 'Unauthorized') {
        console.error('Sepet yüklenemedi:', error.message);
      }
      setCart([]);
      setCartTotal(null);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı giriş yaptığında sepeti yükle
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart([]);
      setCartTotal(null);
    }
  }, [isAuthenticated]); // Sadece authentication durumuna bağlı

  // Sepete ürün ekle
  const addToCart = async (
    urunId: number,
    miktar: number,
    rezervasyonBilgileri?: any
  ) => {
    try {
      setLoading(true);
      await cartService.addToCart({ urunId, miktar, rezervasyonBilgileri });
      await loadCart(); // Sepeti yenile
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sepet öğesini güncelle
  const updateCartItem = async (id: number, miktar: number) => {
    try {
      setLoading(true);
      await cartService.updateCartItem(id, { miktar });
      await loadCart();
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sepetten ürün sil
  const removeFromCart = async (id: number) => {
    try {
      setLoading(true);
      await cartService.removeFromCart(id);
      await loadCart();
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sepeti temizle
  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setCart([]);
      setCartTotal(null);
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sepeti yenile
  const refreshCart = async () => {
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

