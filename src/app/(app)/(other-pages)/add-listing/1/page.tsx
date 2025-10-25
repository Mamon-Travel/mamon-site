'use client'

import Input from '@/shared/Input'
import Select from '@/shared/Select'
import { useLanguage } from '@/hooks/useLanguage'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import FormItem from '../FormItem'

const Page = () => {
  const { T } = useLanguage()
  const router = useRouter()

  // Prefetch the next step to improve performance
  useEffect(() => {
    router.prefetch('/add-listing/2')
  }, [router])

  const handleSubmitForm = async (formData: FormData) => {
    const formObject = Object.fromEntries(formData.entries())
    // Handle form submission logic here
    console.log('Form submitted:', formObject)

    // Redirect to the next step
    router.push('/add-listing/2')
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">{T.addlisting?.page_title_1 || 'Mülk tipi seçin'}</h1>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <Form id="add-listing-form" action={handleSubmitForm} className="flex flex-col gap-y-8">
        {/* ITEM */}
        <FormItem
          label={T.addlisting?.property_type || 'Mülk tipi seçin'}
          desccription={T.addlisting?.property_type_desc || 'Listelemek istediğiniz mülk tipini seçin'}
        >
          <Select name="propertyType">
            <option value="Apartment">{T.addlisting?.apartment || 'Daire'}</option>
            <option value="Hotel">{T.addlisting?.hotel || 'Otel'}</option>
            <option value="Cottage">{T.addlisting?.cottage || 'Kulübe'}</option>
            <option value="Villa">{T.addlisting?.villa || 'Villa'}</option>
            <option value="Cabin">{T.addlisting?.cabin || 'Kabin'}</option>
            <option value="Farm stay">{T.addlisting?.farm_stay || 'Çiftlik Evi'}</option>
            <option value="Houseboat">{T.addlisting?.houseboat || 'Tekne Evi'}</option>
            <option value="Lighthouse">{T.addlisting?.lighthouse || 'Deniz Feneri'}</option>
          </Select>
        </FormItem>
        <FormItem
          label={T.addlisting?.place_name || 'Mülk adı'}
          desccription={T.addlisting?.place_name_desc || 'Mülkünüze bir ad verin'}
        >
          <Input placeholder={T.addlisting?.place_name || 'Mülk adı'} name="place-name" />
        </FormItem>
        <FormItem
          label={T.addlisting?.rental_form || 'Kiralama şekli'}
          desccription={T.addlisting?.rental_form_desc || 'Mülkün kiralama şeklini seçin'}
        >
          <Select name="rentalForm">
            <option value="Hotel">{T.addlisting?.entire_place || 'Tüm Yer'}</option>
            <option value="Private room">{T.addlisting?.private_room || 'Özel Oda'}</option>
            <option value="Share room">{T.addlisting?.shared_room || 'Paylaşımlı Oda'}</option>
          </Select>
        </FormItem>
      </Form>
    </>
  )
}

export default Page
