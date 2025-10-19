'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import { useLanguage } from '@/hooks/useLanguage'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import userService from '@/services/userService'
import authService from '@/services/authService'

const Page = () => {
  const { T } = useLanguage()
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    mevcutSifre: '',
    yeniSifre: '',
    yeniSifreTekrar: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validasyonlar
    if (!formData.mevcutSifre || !formData.yeniSifre || !formData.yeniSifreTekrar) {
      setError('Tüm alanları doldurunuz')
      return
    }

    if (formData.yeniSifre !== formData.yeniSifreTekrar) {
      setError('Yeni şifreler eşleşmiyor')
      return
    }

    if (formData.yeniSifre.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır')
      return
    }

    setSubmitting(true)

    try {
      const token = authService.getToken()
      if (!token) {
        setError('Oturum bulunamadı')
        setSubmitting(false)
        return
      }

      await userService.updateProfile(token, {
        mevcutSifre: formData.mevcutSifre,
        yeniSifre: formData.yeniSifre,
      })

      setSuccess('Şifreniz başarıyla güncellendi')
      setFormData({
        mevcutSifre: '',
        yeniSifre: '',
        yeniSifreTekrar: '',
      })
    } catch (err: any) {
      setError(err.message || 'Şifre güncellenemedi')
    } finally {
      setSubmitting(false)
    }
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
      <h1 className="text-3xl font-semibold">{T['accountPage']['Update your password']}</h1>

      <Divider className="my-8 w-14!" />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 max-w-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-600 max-w-xl">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <Field>
          <Label>{T['accountPage']['Current password']}</Label>
          <Input
            type="password"
            className="mt-1.5"
            value={formData.mevcutSifre}
            onChange={(e) => setFormData({ ...formData, mevcutSifre: e.target.value })}
            required
          />
        </Field>
        <Field>
          <Label>{T['accountPage']['New password']}</Label>
          <Input
            type="password"
            className="mt-1.5"
            value={formData.yeniSifre}
            onChange={(e) => setFormData({ ...formData, yeniSifre: e.target.value })}
            required
            minLength={6}
          />
          <p className="mt-1 text-sm text-neutral-500">En az 6 karakter</p>
        </Field>
        <Field>
          <Label>{T['accountPage']['Confirm password']}</Label>
          <Input
            type="password"
            className="mt-1.5"
            value={formData.yeniSifreTekrar}
            onChange={(e) => setFormData({ ...formData, yeniSifreTekrar: e.target.value })}
            required
          />
        </Field>
        <div className="pt-4">
          <ButtonPrimary type="submit" disabled={submitting}>
            {submitting ? 'Güncelleniyor...' : T['accountPage']['Update password']}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  )
}

export default Page
