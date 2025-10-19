'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import T from '@/utils/getT'

const navigation = [
  {
    title: 'Account',
    titleKey: 'Account',
    href: '/account',
  },
  {
    title: 'Saved listings',
    titleKey: 'Saved listings',
    href: '/account-savelists',
  },
  {
    title: 'Password',
    titleKey: 'Password',
    href: '/account-password',
  },
  {
    title: 'Payments & payouts',
    titleKey: 'Payments & payouts',
    href: '/account-billing',
  },
]

export const PageNavigation = () => {
  const pathname = usePathname()

  return (
    <div className="container">
      <div className="hidden-scrollbar flex gap-x-8 overflow-x-auto md:gap-x-14">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`block shrink-0 border-b-2 py-5 capitalize md:py-8 ${
                isActive ? 'border-primary-500 font-medium' : 'border-transparent'
              }`}
            >
              {T['accountPage'][item.titleKey as keyof typeof T.accountPage] || item.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
