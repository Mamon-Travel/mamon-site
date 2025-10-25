'use client'

import { Divider } from '@/shared/divider'
import { useLanguage } from '@/hooks/useLanguage'
import { ImageAdd02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const { T } = useLanguage()
  const router = useRouter()

  // Prefetch the next step to improve performance
  useEffect(() => {
    router.prefetch('/add-listing/8')
  }, [router])

  const handleSubmitForm = async (formData: FormData) => {
    const formObject = Object.fromEntries(formData.entries())
    // Handle form submission logic here
    console.log('Form submitted:', formObject)

    // Redirect to the next step
    router.push('/add-listing/8')
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">{T.addlisting?.page_title_7 || 'Görseller'}</h2>
        <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
          {T.addlisting?.page_desc_7 || 'Mülkünüzün görsellerini ekleyin'}
        </span>
      </div>

      <Divider className="w-14!" />
      {/* FORM */}
      <Form id="add-listing-form" action={handleSubmitForm} className="space-y-8">
        <div>
          <span className="text-lg font-semibold">{T.addlisting?.cover_image || 'Kapak görseli'}</span>
          <div className="mt-5">
            <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-neutral-300 px-6 pt-5 pb-6 dark:border-neutral-600">
              <div className="space-y-1 text-center">
                <HugeiconsIcon className="mx-auto text-neutral-400" icon={ImageAdd02Icon} size={48} strokeWidth={1} />

                <div className="flex text-sm text-neutral-600 dark:text-neutral-300">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary-600 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-primary-500"
                  >
                    <span>{T.addlisting?.upload_file || 'Dosya yükle'}</span>
                    <input id="file-upload" name="cover" type="file" className="sr-only" />
                  </label>
                  <p className="ps-1">{T.addlisting?.or_drag_drop || 'veya sürükle bırak'}</p>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {T.addlisting?.image_format || 'PNG, JPG, GIF max 10MB'}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* ----------------- */}
        <div>
          <span className="text-lg font-semibold">{T.addlisting?.place_pictures || 'Yer görselleri'}</span>
          <div className="mt-5">
            <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-neutral-300 px-6 pt-5 pb-6 dark:border-neutral-600">
              <div className="space-y-1 text-center">
                <HugeiconsIcon className="mx-auto text-neutral-400" icon={ImageAdd02Icon} size={48} strokeWidth={1} />

                <div className="flex text-sm text-neutral-600 dark:text-neutral-300">
                  <label
                    htmlFor="file-upload-2"
                    className="relative cursor-pointer rounded-md font-medium text-primary-600 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-primary-500"
                  >
                    <span>{T.addlisting?.upload_file || 'Dosya yükle'}</span>
                    <input id="file-upload-2" name="gallery" type="file" className="sr-only" />
                  </label>
                  <p className="ps-1">{T.addlisting?.or_drag_drop || 'veya sürükle bırak'}</p>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {T.addlisting?.image_format || 'PNG, JPG, GIF max 10MB'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  )
}

export default Page
