'use client'

import { GuestsObject } from '@/type'
import converSelectedDateToString from '@/utils/converSelectedDateToString'
import { useLanguage } from '@/hooks/useLanguage'
import * as Headless from '@headlessui/react'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DatesRangeInput from '../DatesRangeInput'
import FieldPanelContainer from '../FieldPanelContainer'
import GuestsInput from '../GuestsInput'
import LocationInput from '../LocationInput'

const FlightSearchFormMobile = () => {
  const { T } = useLanguage()
  
  const dropOffLocationTypes = [
    { value: 'Round-trip', label: T.herosearch?.round_trip || 'Gidiş-Dönüş' },
    { value: 'One-way', label: T.herosearch?.one_way || 'Tek Yön' },
  ] as const
  
  const flightClasses = [
    { value: 'Economy', label: T.herosearch?.economy || 'Ekonomi' },
    { value: 'Business', label: T.herosearch?.business || 'Business' },
    { value: 'Multiple', label: T.herosearch?.multiple || 'Çoklu' },
  ] as const
  //
  const [fieldNameShow, setFieldNameShow] = useState<
    'locationPickup' | 'locationDropoff' | 'dates' | 'guests' | 'general'
  >('locationPickup')
  //
  const [locationInputPickUp, setLocationInputPickUp] = useState('')
  const [locationInputDropOff, setLocationInputDropOff] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(new Date('2023/02/06'))
  const [endDate, setEndDate] = useState<Date | null>(new Date('2023/02/23'))

  const [dropOffLocationType, setDropOffLocationType] = useState(dropOffLocationTypes[0].value)
  const [flightClassState, setFlightClassState] = useState(flightClasses[0].value)

  const [guestInput, setGuestInput] = useState<GuestsObject>({
    guestAdults: 0,
    guestChildren: 0,
    guestInfants: 0,
  })
  const router = useRouter()

  const handleFormSubmit = (formData: FormData) => {
    const formDataEntries = Object.fromEntries(formData.entries())
    console.log('Form submitted', formDataEntries)
    // You can also redirect or perform other actions based on the form data

    // example: add location to the URL
    const location = formDataEntries['locationPickup'] as string
    let url = '/flight-categories/all'
    if (location) {
      url = url + `?location=${encodeURIComponent(location)}`
    }
    router.push(url)
  }

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const renderInputLocationPickup = () => {
    return (
      <FieldPanelContainer
        isActive={fieldNameShow === 'locationPickup'}
        headingOnClick={() => setFieldNameShow('locationPickup')}
        headingTitle={T.herosearch?.pickup || 'Kalkış'}
        headingValue={locationInputPickUp || T.herosearch?.location || 'Konum'}
      >
        <LocationInput
          headingText={(T.herosearch?.pickup || 'Kalkış') + '?'}
          imputName="locationPickup"
          defaultValue={locationInputPickUp}
          onChange={(value) => {
            setLocationInputPickUp(value)
            setFieldNameShow('dates')
          }}
        />
      </FieldPanelContainer>
    )
  }

  const renderInputLocationDropOff = () => {
    return (
      <FieldPanelContainer
        isActive={fieldNameShow === 'locationDropoff'}
        headingOnClick={() => setFieldNameShow('locationDropoff')}
        headingTitle={T.herosearch?.dropoff || 'Varış'}
        headingValue={locationInputDropOff || T.herosearch?.location || 'Konum'}
      >
        <LocationInput
          headingText={(T.herosearch?.dropoff || 'Varış') + '?'}
          imputName="locationDropOff"
          defaultValue={locationInputDropOff}
          onChange={(value) => {
            setLocationInputDropOff(value)
            setFieldNameShow('dates')
          }}
        />
      </FieldPanelContainer>
    )
  }

  const renderInputDates = () => {
    return (
      <FieldPanelContainer
        isActive={fieldNameShow === 'dates'}
        headingOnClick={() => setFieldNameShow('dates')}
        headingTitle={T.herosearch?.when || 'Ne zaman'}
        headingValue={startDate ? converSelectedDateToString([startDate, endDate]) : T.herosearch?.add_dates || 'Tarih ekle'}
      >
        <DatesRangeInput onChange={onChangeDate} />
      </FieldPanelContainer>
    )
  }

  const renderGenerals = () => {
    const currentDropOffLabel = dropOffLocationTypes.find(t => t.value === dropOffLocationType)?.label || dropOffLocationType
    const currentFlightLabel = flightClasses.find(t => t.value === flightClassState)?.label || flightClassState
    
    return (
      <FieldPanelContainer
        isActive={fieldNameShow === 'general'}
        headingOnClick={() => setFieldNameShow('general')}
        headingTitle={T.herosearch?.flight_type || 'Uçuş tipi?'}
        headingValue={`${currentDropOffLabel}, ${currentFlightLabel}`}
      >
        <p className="block text-xl font-semibold sm:text-2xl">{T.herosearch?.flight_type || 'Uçuş tipi?'}</p>
        <div className="relative mt-5">
          <Headless.RadioGroup
            value={dropOffLocationType}
            onChange={setDropOffLocationType}
            aria-label="Real Estate Tab Type"
            name="dropOffLocationType"
            className="flex flex-wrap items-center gap-2.5"
          >
            {dropOffLocationTypes.map((tab) => (
              <Headless.Field key={tab.value}>
                <Headless.Radio
                  value={tab.value}
                  className={`flex cursor-pointer items-center rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium data-checked:bg-black data-checked:text-white data-checked:shadow-lg data-checked:shadow-black/10 dark:border-neutral-700 dark:data-checked:bg-neutral-200 dark:data-checked:text-neutral-900`}
                >
                  {tab.label}
                </Headless.Radio>
              </Headless.Field>
            ))}
          </Headless.RadioGroup>

          <div className="mt-6">
            <p className="text-base font-semibold">{T.herosearch?.ticket_class || 'Bilet Sınıfı'}</p>
            <Headless.RadioGroup
              value={flightClassState}
              onChange={setFlightClassState}
              aria-label="Real Estate Tab Type"
              name="flightClasses"
              className="mt-4 flex flex-wrap items-center gap-2.5"
            >
              {flightClasses.map((tab) => (
                <Headless.Field key={tab.value}>
                  <Headless.Radio
                    value={tab.value}
                    className={`flex cursor-pointer items-center rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium data-checked:bg-black data-checked:text-white data-checked:shadow-lg data-checked:shadow-black/10 dark:border-neutral-700 dark:data-checked:bg-neutral-200 dark:data-checked:text-neutral-900`}
                  >
                    {tab.label}
                  </Headless.Radio>
                </Headless.Field>
              ))}
            </Headless.RadioGroup>
          </div>
        </div>
      </FieldPanelContainer>
    )
  }

  const renderInputGuests = () => {
    const isActive = fieldNameShow === 'guests'
    const totalGuests = (guestInput.guestAdults || 0) + (guestInput.guestChildren || 0) + (guestInput.guestInfants || 0)
    const guestStringConverted = totalGuests
      ? `${totalGuests} ${T.herosearch?.guests || 'Misafirler'}`
      : T.herosearch?.add_guests || 'Misafir ekle'

    return (
      <FieldPanelContainer
        isActive={isActive}
        headingOnClick={() => setFieldNameShow('guests')}
        headingTitle={T.herosearch?.who || 'Kimler'}
        headingValue={guestStringConverted}
      >
        <GuestsInput defaultValue={guestInput} onChange={setGuestInput} />
      </FieldPanelContainer>
    )
  }

  return (
    <Form id="form-hero-search-form-mobile" action={handleFormSubmit} className="flex w-full flex-col gap-y-3">
      {renderInputLocationPickup()}
      {/*  */}
      {renderInputLocationDropOff()}
      {/*  */}
      {renderGenerals()}
      {/*  */}
      {renderInputDates()}
      {/*  */}
      {renderInputGuests()}
    </Form>
  )
}

export default FlightSearchFormMobile
