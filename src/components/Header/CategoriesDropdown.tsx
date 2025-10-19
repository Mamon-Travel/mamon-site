'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { getHizmetler, Hizmet } from '@/services/hizmetlerService'
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Airplane02Icon, Building03Icon, Car03Icon, HotAirBalloonIcon, House04Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// İkon mapping'i
const iconMap: { [key: string]: any } = {
  'House03Icon': House04Icon,
  'Car05Icon': Car03Icon,
  'RealEstate02Icon': Building03Icon,
  'HotAirBalloonFreeIcons': HotAirBalloonIcon,
  'Airplane02Icon': Airplane02Icon,
}

// Varsayılan ikon
const defaultIcon = House04Icon

export default function DropdownTravelers() {
  const pathName = usePathname()
  const { translations: T, isLoaded } = useLanguage()
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHizmetler = async () => {
      try {
        const data = await getHizmetler()
        setHizmetler(data)
      } catch (error) {
        console.error('Hizmetler yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHizmetler()
  }, [])

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center p-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Yükleniyor...
      </div>
    )
  }

  return (
    <Popover className="group">
      <PopoverButton className="-m-2.5 flex items-center p-2.5 text-sm font-medium text-neutral-700 group-hover:text-neutral-950 focus:outline-hidden dark:text-neutral-300 dark:group-hover:text-neutral-100">
        Travelers
        <ChevronDownIcon className="ms-1 size-4 group-data-open:rotate-180" aria-hidden="true" />
      </PopoverButton>
      <PopoverPanel
        anchor={{
          to: 'bottom start',
          gap: 16,
        }}
        transition
        className="z-40 w-80 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0 sm:px-0 dark:ring-white/10"
      >
        <div>
          <div className="relative grid grid-cols-1 gap-7 bg-white p-7 dark:bg-neutral-800">
            {hizmetler.map((hizmet) => {
              const isActive = pathName === hizmet.url
              const IconComponent = iconMap[hizmet.ikon] || defaultIcon
              
              return (
                <CloseButton
                  as={Link}
                  key={hizmet.id}
                  href={hizmet.url}
                  className={`focus-visible:ring-opacity-50 -m-3 flex items-center rounded-lg p-2 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 ${
                    isActive ? 'bg-neutral-50 dark:bg-neutral-700' : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <div 
                    className="flex size-10 flex-shrink-0 items-center justify-center rounded-md sm:h-12 sm:w-12"
                    style={{ 
                      backgroundColor: hizmet.renk + '20', // %20 opacity
                      color: hizmet.renk 
                    }}
                  >
                    <HugeiconsIcon icon={IconComponent} size={28} color="currentColor" strokeWidth={1.5} />
                  </div>
                  <div className="ms-4 space-y-0.5">
                    <p className="text-sm font-medium">{hizmet.ad}</p>
                    <p className="line-clamp-1 text-xs text-neutral-500 dark:text-neutral-300">{hizmet.aciklama}</p>
                  </div>
                </CloseButton>
              )
            })}
          </div>
          {/* FOOTER */}
          <div className="bg-neutral-50 p-4 dark:bg-neutral-700">
            <Link
              href="/"
              className="focus-visible:ring-opacity-50 flow-root space-y-0.5 rounded-md px-2 py-2 focus:outline-none focus-visible:ring focus-visible:ring-orange-500"
            >
              <span className="flex items-center">
                <span className="text-sm font-medium">{T['Header']['DropdownTravelers']['footerDoc']}</span>
              </span>
              <span className="line-clamp-1 text-sm text-gray-500 dark:text-neutral-400">
                {T['Header']['DropdownTravelers']['footerDescription']}
              </span>
            </Link>
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  )
}
