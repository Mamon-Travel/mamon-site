'use client'

import VectorImg from '@/images/VectorHIW.svg'
import Heading from '@/shared/Heading'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import howItWorksService, { HowItWorksStep } from '@/services/howItWorksService'
import { useLanguage } from '@/hooks/useLanguage'

export interface SectionHowItWorkProps {
  className?: string
  title?: string
}

const SectionHowItWork: FC<SectionHowItWorkProps> = ({ className = '', title }) => {
  const { T } = useLanguage()
  const [steps, setSteps] = useState<HowItWorksStep[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSteps() {
      try {
        const data = await howItWorksService.getAnasayfaAdimlar()
        setSteps(data)
      } catch (error) {
        console.error('Nasıl çalışır adımları yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSteps()
  }, [])

  const finalTitle = title || T.homepage?.how_it_works || 'How it work'

  if (loading) {
    return (
      <div className={`nc-SectionHowItWork ${className} py-16`}>
        <div className="text-center text-gray-500">Yükleniyor...</div>
      </div>
    )
  }
  return (
    <div className={`nc-SectionHowItWork ${className}`} data-nc-id="SectionHowItWork">
      <Heading isCenter subheading={T.homepage?.how_it_works_sub || 'Keep calm & travel on'}>
        {finalTitle}
      </Heading>
      <div className="relative mt-20 grid gap-20 md:grid-cols-3">
        <Image className="absolute inset-x-0 top-10 hidden md:block" src={VectorImg} alt="vector" />
        {steps.map((step) => (
          <div key={step.id} className="relative mx-auto flex max-w-xs flex-col items-center">
            {step.gorsel_url_dark ? (
              <>
                <img 
                  className="mx-auto mb-8 block max-w-[180px] dark:hidden" 
                  src={step.gorsel_url} 
                  alt={step.baslik}
                  width={180}
                  height={180}
                />
                <img 
                  className="mx-auto mb-8 hidden max-w-[180px] dark:block" 
                  src={step.gorsel_url_dark} 
                  alt={step.baslik}
                  width={180}
                  height={180}
                />
              </>
            ) : (
              <img 
                className="mx-auto mb-8 max-w-[180px]" 
                src={step.gorsel_url} 
                alt={step.baslik}
                width={180}
                height={180}
              />
            )}
            <div className="mt-auto text-center">
              <h3 className="text-xl font-semibold">{step.baslik}</h3>
              <span className="mt-5 block text-neutral-500 dark:text-neutral-400">
                {step.aciklama}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionHowItWork
