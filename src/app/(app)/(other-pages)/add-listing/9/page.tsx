'use client'

import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import NcInputNumber from '@/components/NcInputNumber'
import { Divider } from '@/shared/divider'
import { useLanguage } from '@/hooks/useLanguage'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'

const PageAddListing9 = () => {
  const { T } = useLanguage()
  const [dates, setDates] = useState<number[]>([
    new Date().getTime(),
    new Date(new Date().getTime() + 60 * 60 * 24 * 1000).getTime(),
    new Date(new Date().getTime() + 3 * 60 * 60 * 24 * 1000).getTime(),
    new Date(new Date().getTime() + 4 * 60 * 60 * 24 * 1000).getTime(),
  ])
  const router = useRouter()

  // Prefetch the next step to improve performance
  useEffect(() => {
    router.prefetch('/add-listing/10')
  }, [router])

  const handleSubmitForm = async (formData: FormData) => {
    const formObject = Object.fromEntries(formData.entries())
    // Handle form submission logic here
    console.log('Form submitted:', formObject)

    // Redirect to the next step
    router.push('/add-listing/10')
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">{T.addlisting?.page_title_9 || 'Müsaitlik'}</h1>
        <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
          {T.addlisting?.page_desc_9 || 'Müsaitlik ayarlarınızı yapın'}
        </span>
      </div>
      <Divider className="w-14!" />

      <Form id="add-listing-form" action={handleSubmitForm} className="flex flex-col gap-y-5">
        <NcInputNumber inputName="Nights-min" label={T.addlisting?.nights_min || 'Min gece sayısı'} defaultValue={1} />
        <NcInputNumber inputName="Nights-max" label={T.addlisting?.nights_max || 'Max gece sayısı'} defaultValue={90} />

        {dates
          .map((item) => new Date(item))
          .map((date, index) => (
            <input type="hidden" name="excludeDates[]" key={index} value={date.toISOString()} />
          ))}
      </Form>

      <div>
        <h2 className="text-2xl font-semibold">{T.addlisting?.availability || 'Müsaitlik takvimi'}</h2>
        <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
          {T.addlisting?.availability_desc || 'Müsait olmayan tarihleri seçin'}
        </span>
      </div>

      <div className="addListingDatePickerExclude">
        <DatePicker
          onChange={(date) => {
            let newDates = []

            if (!date) {
              return
            }
            const newTime = date.getTime()
            if (dates.includes(newTime)) {
              newDates = dates.filter((item) => item !== newTime)
            } else {
              newDates = [...dates, newTime]
            }
            setDates(newDates)
          }}
          // selected={startDate}
          monthsShown={2}
          showPopperArrow={false}
          excludeDates={dates.filter(Boolean).map((item) => new Date(item))}
          inline
          renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
          renderDayContents={(day, date) => <DatePickerCustomDay dayOfMonth={day} date={date} />}
        />
      </div>
    </>
  )
}

export default PageAddListing9
