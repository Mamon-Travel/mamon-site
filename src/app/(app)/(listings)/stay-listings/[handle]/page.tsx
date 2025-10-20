import {
  Bathtub02Icon,
  BedSingle01Icon,
  BodySoapIcon,
  CableCarIcon,
  CctvCameraIcon,
  HairDryerIcon,
  MeetingRoomIcon,
  ShampooIcon,
  Speaker01Icon,
  TvSmartIcon,
  VirtualRealityVr01Icon,
  WaterEnergyIcon,
  WaterPoloIcon,
  Wifi01Icon,
} from '@/components/Icons'
import { getListingReviews } from '@/data/data'
import { getStayListingByHandle } from '@/data/listings'
import { getOtelBySlug, getOdaTipleri } from '@/services/otelService'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import { Divider } from '@/shared/divider'
import T from '@/utils/getT'
import { UsersIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'
import Form from 'next/form'
import { redirect } from 'next/navigation'
import { Fragment } from 'react'
import DatesRangeInputPopover from '../../components/DatesRangeInputPopover'
import GuestsInputPopover from '../../components/GuestsInputPopover'
import HeaderGallery from '../../components/HeaderGallery'
import SectionDateRange from '../../components/SectionDateRange'
import SectionHeader from '../../components/SectionHeader'
import { SectionHeading, SectionSubheading } from '../../components/SectionHeading'
import SectionHost from '../../components/SectionHost'
import SectionListingReviews from '../../components/SectionListingReviews'
import SectionMap from '../../components/SectionMap'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const listing = await getStayListingByHandle(handle)

  if (!listing) {
    return {
      title: 'Listing not found',
      description: 'The listing you are looking for does not exist.',
    }
  }

  return {
    title: listing?.title,
    description: listing?.description,
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params

  // Önce gerçek otel verisini dene
  const otel = await getOtelBySlug(handle)
  
  let listing
  
  if (otel) {
    // Oda tiplerini getir
    const odaTipleri = await getOdaTipleri(otel.id)
    
    // Otel verisini listing formatına dönüştür
    listing = {
      id: `stay-listing://${otel.id}`,
      date: new Date(otel.olusturma_tarihi).toLocaleDateString('tr-TR'),
      listingCategory: otel.konsept || 'Otel',
      title: otel.ad,
      handle: otel.slug,
      description: otel.detay?.uzun_aciklama || otel.detay?.kisa_aciklama || '',
      featuredImage: otel.kapak_gorseli || 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      galleryImgs: otel.gorseller && otel.gorseller.length > 0 
        ? otel.gorseller.map((g: any) => g.gorsel_url)
        : [otel.kapak_gorseli || ''],
      like: false,
      address: otel.adres || `${otel.sehir}${otel.bolge ? ', ' + otel.bolge : ''}`,
      reviewStart: 4.5,
      reviewCount: 0,
      price: otel.min_fiyat ? `₺${otel.min_fiyat}` : '₺0',
      maxGuests: odaTipleri.reduce((max, oda) => Math.max(max, oda.kapasite || 0), 0) || 2,
      bedrooms: otel.detay?.oda_sayisi || odaTipleri.length || 0,
      bathrooms: 1,
      beds: odaTipleri.length || 1,
      saleOff: undefined,
      isAds: false,
      map: otel.enlem && otel.boylam ? { lat: otel.enlem, lng: otel.boylam } : undefined,
      host: {
        name: otel.ad,
        avatar: otel.kapak_gorseli || '',
        email: otel.email || '',
        href: `/stay-listings/${otel.slug}`,
      },
      odaTipleri, // Gerçek oda tipleri
      otelOzellikleri: otel.otelOzellikleri || [], // Otel özellikleri
      otelDetay: otel.detay, // Detaylı bilgiler
    }
  } else {
    // Fallback: Fake data kullan
    listing = await getStayListingByHandle(handle)
  }

  if (!listing?.id) {
    return redirect('/stay-categories/all')
  }
  const {
    address,
    bathrooms,
    bedrooms,
    date,
    description,
    featuredImage,
    galleryImgs,
    isAds,
    like,
    listingCategory,
    map,
    maxGuests,
    price,
    reviewCount,
    reviewStart,
    saleOff,
    title,
    host,
    beds,
  } = listing
  const reviews = (await getListingReviews(handle)).slice(0, 3) // Fetching only the first 3 reviews for display

  // Server action to handle form submission
  const handleSubmitForm = async (formData: FormData) => {
    'use server'

    // Handle form submission logic here
    console.log('Form submitted with data:', Object.fromEntries(formData.entries()))
    // For example, you can redirect to a checkout page or process the booking
    redirect('/checkout')
  }
  //

  const renderSectionHeader = () => {
    return (
      <SectionHeader
        address={address}
        host={host}
        listingCategory={listingCategory}
        reviewCount={reviewCount}
        reviewStart={reviewStart}
        title={title}
      >
        <div className="flex items-center gap-x-3">
          <UsersIcon className="mb-0.5 size-6" />
          <span>{maxGuests} guests</span>
        </div>
        <div className="flex items-center gap-x-3">
          <BedSingle01Icon className="mb-0.5 size-6" />
          <span>{beds} beds</span>
        </div>
        <div className="flex items-center gap-x-3">
          <Bathtub02Icon className="mb-0.5 size-6" />
          <span>{bathrooms} baths</span>
        </div>
        <div className="flex items-center gap-x-3">
          <MeetingRoomIcon className="mb-0.5 size-6" />
          <span>{bedrooms} bedrooms</span>
        </div>
      </SectionHeader>
    )
  }

  const renderSectionInfo = () => {
    // @ts-ignore - odaTipleri gerçek otel verisinden geliyor
    const odaTipleri = listing.odaTipleri || []
    // @ts-ignore - otelDetay gerçek otel verisinden geliyor
    const otelDetay = listing.otelDetay

    return (
      <div className="listingSection__wrap">
        <SectionHeading>Otel Bilgileri</SectionHeading>
        <div className="leading-relaxed text-neutral-700 dark:text-neutral-300">
          <span>{description || 'Otel hakkında detaylı bilgi yakında eklenecek.'}</span>
        </div>

        {otelDetay && (
          <>
            <Divider className="w-14!" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {otelDetay.denize_mesafe && (
                <div>
                  <span className="font-semibold">Denize Mesafe: </span>
                  <span>{otelDetay.denize_mesafe}</span>
                </div>
              )}
              {otelDetay.havalimani_mesafe && (
                <div>
                  <span className="font-semibold">Havalimanına Mesafe: </span>
                  <span>{otelDetay.havalimani_mesafe}</span>
                </div>
              )}
              {otelDetay.sehir_merkezi_mesafe && (
                <div>
                  <span className="font-semibold">Şehir Merkezine Mesafe: </span>
                  <span>{otelDetay.sehir_merkezi_mesafe}</span>
                </div>
              )}
              {otelDetay.acilis_yili && (
                <div>
                  <span className="font-semibold">Açılış Yılı: </span>
                  <span>{otelDetay.acilis_yili}</span>
                </div>
              )}
            </div>
          </>
        )}

        {odaTipleri.length > 0 && (
          <>
            <Divider className="w-14!" />
            <div>
              <SectionHeading>Oda Tipleri ve Fiyatları</SectionHeading>
              <SectionSubheading>Mevcut oda tipleri ve gecelik fiyatları</SectionSubheading>
            </div>
            <DescriptionList>
              {odaTipleri.map((oda: any) => (
                <Fragment key={oda.id}>
                  <DescriptionTerm>
                    {oda.ad}
                    <span className="block text-xs text-gray-500 font-normal mt-1">
                      {oda.yetiskin_kapasite} Yetişkin
                      {oda.cocuk_kapasite > 0 && `, ${oda.cocuk_kapasite} Çocuk`}
                      {oda.metrekare && ` • ${oda.metrekare}m²`}
                    </span>
                  </DescriptionTerm>
                  <DescriptionDetails>
                    {oda.fiyat ? `₺${oda.fiyat} / Gece` : 'Fiyat Yok'}
                  </DescriptionDetails>
                </Fragment>
              ))}
            </DescriptionList>
          </>
        )}
      </div>
    )
  }

  const renderSectionAmenities = () => {
    // @ts-ignore - otelOzellikleri gerçek otel verisinden geliyor
    const otelOzellikleri = listing.otelOzellikleri || []

    // Fallback icon map
    const iconMap: Record<string, any> = {
      'wifi': Wifi01Icon,
      'havuz': WaterPoloIcon,
      'spa': BodySoapIcon,
      'tv': TvSmartIcon,
      'default': Wifi01Icon,
    }

    return (
      <div className="listingSection__wrap">
        <div>
          <SectionHeading>Otel Özellikleri</SectionHeading>
          <SectionSubheading>Otel tesislerinde bulunan olanaklar</SectionSubheading>
        </div>
        <Divider className="w-14!" />

        {otelOzellikleri.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 text-sm text-neutral-700 xl:grid-cols-3 dark:text-neutral-300">
            {otelOzellikleri.map((ozellik: any) => {
              const IconComponent = iconMap[ozellik.baslik?.toLowerCase()] || iconMap['default']
              return (
                <div key={ozellik.id} className="flex items-center gap-x-3">
                  {ozellik.ikon ? (
                    <span className="text-2xl">{ozellik.ikon}</span>
                  ) : (
                    <IconComponent className="h-6 w-6" />
                  )}
                  <div>
                    <span className="font-medium">{ozellik.baslik}</span>
                    {ozellik.aciklama && (
                      <span className="block text-xs text-gray-500">{ozellik.aciklama}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span>Otel özellikleri bilgisi henüz eklenmemiş</span>
          </div>
        )}
      </div>
    )
  }

  const renderSidebarPriceAndForm = () => {
    return (
      <div className="listingSection__wrap sm:shadow-xl">
        {/* PRICE */}
        <div className="flex items-end text-2xl font-semibold sm:text-3xl">
          <span className="text-neutral-300 line-through">$350</span>
          <span className="mx-2">{price}</span>
          <div className="pb-1">
            <span className="text-base font-normal text-neutral-500 dark:text-neutral-400">/night</span>
          </div>
        </div>

        {/* FORM */}
        <Form
          action={handleSubmitForm}
          className="flex flex-col rounded-3xl border border-neutral-200 dark:border-neutral-700"
          id="booking-form"
        >
          <DatesRangeInputPopover className="z-11 flex-1" />
          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          <GuestsInputPopover className="flex-1" />
        </Form>

        <DescriptionList>
          <DescriptionTerm>$19.00 x 3 day</DescriptionTerm>
          <DescriptionDetails className="sm:text-right">$57.00</DescriptionDetails>
          <DescriptionTerm className="font-semibold text-neutral-900">Total</DescriptionTerm>
          <DescriptionDetails className="font-semibold sm:text-right">$57.00</DescriptionDetails>
        </DescriptionList>

        {/* SUBMIT */}
        <ButtonPrimary form="booking-form" type="submit" className="w-full">
          {T['common']['Reserve']}
        </ButtonPrimary>
      </div>
    )
  }

  return (
    <div>
      {/*  HEADER */}
      <HeaderGallery images={galleryImgs} />

      {/* MAIN */}
      <main className="relative z-[1] mt-10 flex flex-col gap-8 lg:flex-row xl:gap-10">
        {/* CONTENT */}
        <div className="flex w-full flex-col gap-y-8 lg:w-3/5 xl:w-[64%] xl:gap-y-10">
          {renderSectionHeader()}
          {renderSectionInfo()}
          {renderSectionAmenities()}
          <SectionDateRange />
        </div>

        {/* SIDEBAR */}
        <div className="grow">
          <div className="sticky top-5">{renderSidebarPriceAndForm()}</div>
        </div>
      </main>

      <Divider className="my-16" />

      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="w-full lg:w-4/9 xl:w-1/3">
            <SectionHost {...host} />
          </div>
          <div className="w-full lg:w-2/3">
            <SectionListingReviews reviewCount={reviewCount} reviewStart={reviewStart} reviews={reviews} />
          </div>
        </div>

        <SectionMap />
      </div>
    </div>
  )
}

export default Page
