'use client'

import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import HeroSectionWithSearchForm1 from '@/components/hero-sections/HeroSectionWithSearchForm1'
import HeroSearchForm from '@/components/HeroSearchForm/HeroSearchForm'
import SectionBecomeAnAuthor from '@/components/SectionBecomeAnAuthor'
import SectionClientSay from '@/components/SectionClientSay'
import SectionGridAuthorBox from '@/components/SectionGridAuthorBox'
import SectionGridCategoryBox from '@/components/SectionGridCategoryBox'
import SectionGridFeaturePlaces from '@/components/SectionGridFeaturePlaces'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import SectionVideos from '@/components/SectionVideos'
import SectionGridProducts from '@/components/SectionGridProducts'
import { getAuthors } from '@/data/authors'
import { getStayCategories } from '@/data/categories'
import { getStayListings } from '@/data/listings'
import heroImage from '@/images/hero-right.png'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import HeadingWithSub from '@/shared/Heading'
import { useLanguage } from '@/hooks/useLanguage'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports to prevent hydration errors
const SectionOurFeatures = dynamic(() => import('@/components/SectionOurFeatures'), {
  ssr: false,
  loading: () => <div className="py-14 text-center">Yükleniyor...</div>
})

const SectionHowItWork = dynamic(() => import('@/components/SectionHowItWork'), {
  ssr: false,
  loading: () => <div className="py-16 text-center">Yükleniyor...</div>
})

function Page() {
  const { T, isLoaded } = useLanguage()
  const [categories, setCategories] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesData, authorsData] = await Promise.all([
          getStayCategories(),
          getAuthors()
        ])
        setCategories(categoriesData)
        setAuthors(authorsData)
      } catch (error) {
        console.error('Veri yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading || !isLoaded) {
    return (
      <main className="relative overflow-hidden">
        <BgGlassmorphism />
        <div className="relative container mb-24 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">Yükleniyor...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative overflow-hidden">
      <BgGlassmorphism />
      <div className="relative container mb-24 flex flex-col gap-y-24 lg:mb-28 lg:gap-y-32">
        <HeroSectionWithSearchForm1
          heading={T.homepage?.hero_heading || 'Hotel, car, experiences'}
          image={heroImage}
          imageAlt="hero"
          searchForm={<HeroSearchForm initTab="Stays" />}
          description={
            <>
              <p className="max-w-xl text-base text-neutral-500 sm:text-xl dark:text-neutral-400">
                {T.homepage?.hero_description || 'With us, your trip is filled with amazing experiences.'}
              </p>
              <ButtonPrimary href={'/stay-categories/all'} className="sm:text-base/normal">
                {T.homepage?.start_search || 'Start your search'}
              </ButtonPrimary>
            </>
          }
        />

        <div>
          <HeadingWithSub subheading={T.homepage?.explore_best_places || 'Explore the best places to stay in the world.'}>
            {T.homepage?.lets_adventure || "Let's go on an adventure"}
          </HeadingWithSub>
          <SectionSliderNewCategories categoryCardType="card3" categories={categories.slice(0, 7)} />
        </div>

        <SectionOurFeatures className="py-14" />
        
        {/* Konaklama Ürünleri */}
        <div>
          <HeadingWithSub subheading={T.homepage?.best_accommodation_options || 'En iyi konaklama seçenekleri'}>
            {T.homepage?.accommodation || 'Konaklama'}
          </HeadingWithSub>
          <SectionGridProducts hizmetId={1} />
        </div>
        <Divider />
        <SectionHowItWork />
        <div className="relative py-20">
          <BackgroundSection />
          <HeadingWithSub isCenter subheading={T.homepage?.keep_calm_travel || 'Keep calm & travel on'}>
            {T.homepage?.become_host || 'Become a host'}
          </HeadingWithSub>
          <SectionGridAuthorBox authors={authors} />
        </div>
        <SectionSubscribe2 />
        <Divider />

        <div>
          <HeadingWithSub isCenter subheading={T.homepage?.great_places_near || 'Great places near where you live'}>
            {T.homepage?.explore_nearby || 'Explore nearby'}
          </HeadingWithSub>
          <SectionGridCategoryBox categories={categories.slice(0, 8)} />
        </div>

        <div className="relative py-16">
          <BackgroundSection />
          <SectionBecomeAnAuthor />
        </div>

        <div>
          <HeadingWithSub subheading={T.homepage?.explore_by_types_sub || 'Explore houses based on 10 types of stays'}>
            {T.homepage?.explore_by_types || 'Explore by types of stays.'}
          </HeadingWithSub>
          <SectionSliderNewCategories
            itemClassName="w-[17rem] lg:w-1/3 xl:w-1/4"
            categories={categories.slice(7, 16)}
            categoryCardType="card5"
          />
        </div>
        <SectionVideos />
        <div className="relative py-16">
          <SectionClientSay />
        </div>
      </div>
    </main>
  )
}

export default Page
