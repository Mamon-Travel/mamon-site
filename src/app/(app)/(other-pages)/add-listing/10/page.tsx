'use client'

import StayCard from '@/components/StayCard'
import { getStayListings } from '@/data/listings'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { Divider } from '@/shared/divider'
import { useLanguage } from '@/hooks/useLanguage'
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

const Page = () => {
  const { T } = useLanguage()
  const [listing, setListing] = useState<any>(null)

  useEffect(() => {
    async function loadListing() {
      const listings = await getStayListings()
      setListing(listings[0])
    }
    loadListing()
  }, [])

  if (!listing) {
    return <div className="text-center py-8">{T.common?.loading || 'Yükleniyor...'}</div>
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">{T.addlisting?.page_title_10 || 'Önizleme'}</h2>
        <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
          {T.addlisting?.page_desc_10 || 'İlanınızı gözden geçirin'}
        </span>
      </div>

      <Divider className="w-14!" />

      <div>
        <h3 className="text-lg font-semibold">{T.addlisting?.your_listing || 'İlanınız'}</h3>
        <div className="mt-6 max-w-sm">
          <StayCard data={listing} />
        </div>
        <div className="mt-8 flex items-center gap-x-3">
          <ButtonSecondary href={'/add-listing/1'}>
            <PencilSquareIcon className="h-5 w-5" />
            <span>{T.addlisting?.edit || 'Düzenle'}</span>
          </ButtonSecondary>

          <ButtonPrimary href={'/stay-listings/preview-stay-84763232'}>
            <EyeIcon className="h-5 w-5" />
            <span>{T.addlisting?.preview || 'Önizle'}</span>
          </ButtonPrimary>
        </div>
      </div>
      {/*  */}
    </>
  )
}

export default Page
