'use client'

import { ImageAdd02Icon } from '@/components/Icons'
import Avatar from '@/shared/Avatar'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import T from '@/utils/getT'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import userService, { ProfileResponse } from '@/services/userService'
import authService from '@/services/authService'

const Page = () => {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form verileri
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    resim: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const token = authService.getToken()
        if (token) {
          const profileData = await userService.getProfile(token)
          setProfile(profileData)
          setFormData({
            ad: profileData.ad || '',
            soyad: profileData.soyad || '',
            email: profileData.email || '',
            telefon: profileData.telefon || '',
            resim: profileData.resim || '',
          })
        }
      } catch (err) {
        setError('Profil bilgileri yüklenemedi')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchProfile()
    }
  }, [user, authLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const token = authService.getToken()
      if (!token) {
        setError('Oturum bulunamadı')
        setSubmitting(false)
        return
      }

      // Güncelleme verilerini hazırla
      const updateData = {
        ad: formData.ad,
        soyad: formData.soyad,
        email: formData.email,
        telefon: formData.telefon,
      }

      const updatedProfile = await userService.updateProfile(token, updateData)
      setProfile(updatedProfile)
      setSuccess('Profil başarıyla güncellendi')

      // AuthContext'teki kullanıcıyı güncelle
      authService.saveAuth(token, {
        ...user!,
        ad: updatedProfile.ad,
        soyad: updatedProfile.soyad,
        email: updatedProfile.email,
        telefon: updatedProfile.telefon,
        resim: updatedProfile.resim,
      })
    } catch (err: any) {
      setError(err.message || 'Profil güncellenemedi')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Lütfen giriş yapın</div>
      </div>
    )
  }

  return (
    <div>
      {/* HEADING */}
      <h1 className="text-3xl font-semibold">{T['accountPage']['Account information']}</h1>

      <Divider className="my-8 w-14!" />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
        <div className="flex shrink-0 items-start">
          <div className="relative flex overflow-hidden rounded-full">
            <Avatar 
              src={profile?.resim || '/images/avatars/Image-1.png'} 
              className="h-32 w-32" 
            />
            <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 text-neutral-50">
              <ImageAdd02Icon className="h-6 w-6" />
              <span className="mt-1 text-xs">{T['accountPage']['Change Image']}</span>
            </div>
            <input 
              type="file" 
              className="absolute inset-0 cursor-pointer opacity-0"
              accept="image/*"
              disabled
            />
          </div>
        </div>
        <div className="mt-10 max-w-3xl grow space-y-6 md:mt-0 md:ps-16">
          <Field>
            <Label>{T['accountPage']['Name']}</Label>
            <Input 
              className="mt-1.5" 
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              required
            />
          </Field>

          <Field>
            <Label>Soyad</Label>
            <Input 
              className="mt-1.5" 
              value={formData.soyad}
              onChange={(e) => setFormData({ ...formData, soyad: e.target.value })}
              required
            />
          </Field>

          <Field>
            <Label>{T['accountPage']['Email']}</Label>
            <Input 
              className="mt-1.5" 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </Field>

          <Field>
            <Label>{T['accountPage']['Phone number']}</Label>
            <Input 
              className="mt-1.5" 
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
            />
          </Field>

          <div className="pt-4">
            <ButtonPrimary type="submit" disabled={submitting}>
              {submitting ? 'Güncelleniyor...' : T['accountPage']['Update information']}
            </ButtonPrimary>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Page
