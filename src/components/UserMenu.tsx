'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Giriş Yap
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Kayıt Ol
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <div className="flex size-8 items-center justify-center rounded-full bg-primary-600 text-white">
          {user?.ad?.[0]?.toUpperCase()}
        </div>
        <span className="text-neutral-700 dark:text-neutral-300">
          {user?.ad} {user?.soyad}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-800">
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-700">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {user?.ad} {user?.soyad}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</p>
          </div>
          <div className="py-2">
            <Link
              href="/account"
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              onClick={() => setIsOpen(false)}
            >
              Hesabım
            </Link>
            <Link
              href="/account/savelists"
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              onClick={() => setIsOpen(false)}
            >
              Favorilerim
            </Link>
            <Link
              href="/account/password"
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              onClick={() => setIsOpen(false)}
            >
              Şifre Değiştir
            </Link>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



