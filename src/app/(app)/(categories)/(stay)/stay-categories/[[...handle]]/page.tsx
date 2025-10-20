import HeroSectionWithSearchForm1 from '@/components/hero-sections/HeroSectionWithSearchForm1'
import { StaySearchForm } from '@/components/HeroSearchForm/StaySearchForm'
import ListingFilterTabs from '@/components/ListingFilterTabs'
import StayCard2 from '@/components/StayCard2'
import { getStayCategoryByHandle } from '@/data/categories'
import { getStayListingFilterOptions } from '@/data/listings'
import { Button } from '@/shared/Button'
import { Divider } from '@/shared/divider'
import Pagination from '@/shared/Pagination'
import convertNumbThousand from '@/utils/convertNumbThousand'
import { House04Icon, MapPinpoint02Icon, MapsLocation01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAktifOteller } from '@/services/otelService'

export async function generateMetadata({ params }: { params: Promise<{ handle?: string[] }> }): Promise<Metadata> {
  const { handle } = await params
  const category = await getStayCategoryByHandle(handle?.[0])
  if (!category) {
    return {
      title: 'Collection not found',
      description: 'The collection you are looking for does not exist.',
    }
  }
  const { name, description } = category
  return { title: name, description }
}

const Page = async ({ params }: { params: Promise<{ handle?: string[] }> }) => {
  const { handle } = await params

  const category = await getStayCategoryByHandle(handle?.[0])
  const oteller = await getAktifOteller()
  const filterOptions = await getStayListingFilterOptions()

  if (!category?.id) {
    return redirect('/stay-categories/all')
  }

  // Otelleri StayCard2 formatına dönüştür
  const listings = oteller.map((otel) => ({
    id: `stay-listing://${otel.id}`,
    date: new Date(otel.olusturma_tarihi).toLocaleDateString('tr-TR'),
    listingCategory: otel.konsept || 'Otel',
    title: otel.ad,
    handle: otel.slug,
    description: otel.detay?.kisa_aciklama || '',
    featuredImage: otel.kapak_gorseli || 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
    galleryImgs: otel.gorseller && otel.gorseller.length > 0 
      ? otel.gorseller.map((g: any) => g.gorsel_url)
      : [otel.kapak_gorseli || ''],
    like: false,
    address: otel.adres || `${otel.sehir}${otel.bolge ? ', ' + otel.bolge : ''}`,
    reviewStart: 4.5,
    reviewCount: 0,
    price: otel.min_fiyat ? `₺${otel.min_fiyat}` : '₺0',
    maxGuests: otel.odaTipleri?.reduce((max: number, oda: any) => Math.max(max, oda.kapasite || 0), 0) || 2,
    bedrooms: otel.detay?.oda_sayisi || 0,
    bathrooms: 1,
    beds: otel.odaTipleri?.length || 0,
    saleOff: undefined,
    isAds: false,
    map: otel.enlem && otel.boylam ? { lat: otel.enlem, lng: otel.boylam } : undefined,
    host: {
      name: otel.ad,
      avatar: otel.kapak_gorseli || '',
      email: otel.email || '',
    },
  }));

  return (
    <div className="pb-28">
      {/* Hero section */}
      <div className="container">
        <HeroSectionWithSearchForm1
          heading={category.name}
          image={category.coverImage}
          imageAlt={category.name}
          searchForm={<StaySearchForm formStyle="default" />}
          description={
            <div className="flex items-center sm:text-lg">
              <HugeiconsIcon icon={MapPinpoint02Icon} size={20} color="currentColor" strokeWidth={1.5} />
              <span className="ms-2.5">{category.region} </span>
              <span className="mx-5"></span>
              <HugeiconsIcon icon={House04Icon} size={20} color="currentColor" strokeWidth={1.5} />
              <span className="ms-2.5">{convertNumbThousand(category.count)} stays</span>
            </div>
          }
        />
      </div>

      {/* Content */}
      <div className="relative container mt-14 lg:mt-24">
        {/* start heading */}
        <div className="flex flex-wrap items-end justify-between gap-x-2.5 gap-y-5">
          <h2 id="heading" className="scroll-mt-20 text-lg font-semibold sm:text-xl">
            {oteller.length} otel bulundu
            {category.handle !== 'all' ? ` - ${category.name}` : null}
          </h2>
          <Button color="white" className="ms-auto" href={'/stay-categories-map/' + category.handle}>
            <span className="me-1">Show map</span>
            <HugeiconsIcon icon={MapsLocation01Icon} size={20} color="currentColor" strokeWidth={1.5} />
          </Button>
        </div>
        <Divider className="my-8 md:mb-12" />
        {/* end heading */}

        <ListingFilterTabs filterOptions={filterOptions} />
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <StayCard2 key={listing.id} data={listing} />
          ))}
        </div>
        <div className="mt-16 flex items-center justify-center">
          <Pagination />
        </div>
      </div>
    </div>
  )
}

export default Page
