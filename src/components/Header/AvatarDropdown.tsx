'use client';

import { useAuth } from '@/contexts/AuthContext';
import avatarImage from '@/images/avatars/Image-1.png';
import Avatar from '@/shared/Avatar';
import { Button } from '@/shared/Button';
import { Divider } from '@/shared/divider';
import { Link } from '@/shared/link';
import SwitchDarkMode2 from '@/shared/SwitchDarkMode2';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import {
  BulbChargingIcon,
  FavouriteIcon,
  Idea01Icon,
  Logout01Icon,
  Task01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface Props {
  className?: string;
}

export default function AvatarDropdown({ className }: Props) {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return null;
  }

  // Giriş yapmamışsa login/signup butonları göster
  if (!isAuthenticated || !user) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Giriş Yap
          </Link>
          <Button href="/signup" className="text-sm px-4 py-1.5">
            Kayıt Ol
          </Button>
        </div>
      </div>
    );
  }

  // Giriş yapmışsa avatar dropdown göster
  return (
    <div className={className}>
      <Popover>
        <PopoverButton className="-m-1.5 flex cursor-pointer items-center justify-center rounded-full p-1.5 hover:bg-neutral-100 focus-visible:outline-hidden dark:hover:bg-neutral-800">
          {user.resim ? (
            <Avatar src={user.resim} className="size-8" />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white">
              {user.ad?.[0]?.toUpperCase()}
            </div>
          )}
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{
            to: 'bottom end',
            gap: 16,
          }}
          className="z-40 w-80 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
        >
          <div className="relative grid grid-cols-1 gap-6 bg-white px-6 py-7 dark:bg-neutral-800">
            <div className="flex items-center space-x-3">
              {user.resim ? (
                <Avatar src={user.resim} className="size-12" />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-600 text-lg font-medium text-white">
                  {user.ad?.[0]?.toUpperCase()}
                </div>
              )}

              <div className="grow">
                <h4 className="font-semibold">
                  {user.ad} {user.soyad}
                </h4>
                <p className="mt-0.5 text-xs">{user.email}</p>
              </div>
            </div>

            <Divider />

            {/* ------------------ 1 --------------------- */}
            <Link
              href={'/account'}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Hesabım</p>
            </Link>

            {/* ------------------ 2 --------------------- */}
            <Link
              href={'/account'}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Rezervasyonlarım</p>
            </Link>

            {/* ------------------ 3 --------------------- */}
            <Link
              href={'/account/savelists'}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={FavouriteIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Favorilerim</p>
            </Link>

            <Divider />

            {/* ------------------ Dark Mode --------------------- */}
            <div className="focus-visible:ring-opacity-50 -m-3 flex items-center justify-between rounded-lg p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 dark:hover:bg-neutral-700">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={Idea01Icon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Karanlık Tema</p>
              </div>
              <SwitchDarkMode2 />
            </div>

            {/* ------------------ Help --------------------- */}
            <Link
              href={'#'}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={BulbChargingIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Yardım</p>
            </Link>

            {/* ------------------ Logout --------------------- */}
            <button
              onClick={() => logout()}
              className="-m-3 flex w-full items-center rounded-lg p-2 text-left transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Logout01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Çıkış Yap</p>
            </button>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  );
}
