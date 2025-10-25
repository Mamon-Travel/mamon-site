'use client'

import rightImgPng from '@/images/our-features.png'
import { Badge } from '@/shared/Badge'
import { Heading } from '@/shared/Heading'
import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'
import { FC, useEffect, useState } from 'react'
import siteFeatureService, { SiteFeature } from '@/services/siteFeatureService'
import { useLanguage } from '@/hooks/useLanguage'

interface Props {
  className?: string
  rightImg?: StaticImageData
  type?: 'type1' | 'type2'
  subHeading?: string
  heading?: string
}

const SectionOurFeatures: FC<Props> = ({
  className,
  rightImg = rightImgPng,
  type = 'type1',
  subHeading,
  heading,
}) => {
  const { T } = useLanguage()
  const [features, setFeatures] = useState<SiteFeature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeatures() {
      try {
        const data = await siteFeatureService.getAnasayfaOzellikleri()
        setFeatures(data)
      } catch (error) {
        console.error('Site özellikleri yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFeatures()
  }, [])

  const finalSubHeading = subHeading || T.homepage?.features_subheading || 'Benefits'
  const finalHeading = heading || T.homepage?.features_heading || 'Happening cities'
  if (loading) {
    return (
      <div className={clsx('relative flex items-center justify-center py-16', className)}>
        <div className="text-center text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'relative flex flex-col items-center',
        className,
        type === 'type1' ? 'lg:flex-row' : 'lg:flex-row-reverse'
      )}
    >
      <div className="grow">
        <Image src={rightImg} alt="Features" sizes="(max-width: 1024px) 100vw, 50vw" priority />
      </div>
      <div className={`mt-10 max-w-2xl shrink-0 lg:mt-0 lg:w-2/5 ${type === 'type1' ? 'lg:ps-16' : 'lg:pe-16'}`}>
        <span className="text-sm tracking-widest text-gray-400 uppercase">{finalSubHeading}</span>
        <Heading className="mt-4">{finalHeading}</Heading>

        <ul className="mt-16 flex flex-col items-start gap-y-10">
          {features.map((feature) => (
            <li className="flex flex-col items-start gap-y-4" key={feature.id}>
              <Badge color={feature.rozet_renk as 'red' | 'green' | 'blue'}>
                {feature.rozet}
              </Badge>
              <span className="block text-xl font-semibold">{feature.baslik}</span>
              <span className="block text-neutral-500 dark:text-neutral-400">
                {feature.aciklama}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SectionOurFeatures
