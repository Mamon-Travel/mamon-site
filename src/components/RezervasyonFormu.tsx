'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  getAktifPansiyonTipleri,
  calculateTotalPrice,
  checkAvailability,
  PansiyonTipi,
  FiyatHesaplama,
  MusaitlikKontrol,
} from '@/services/rezervasyonService';
import { OdaTipi } from '@/services/otelService';
import PriceConverter from './PriceConverter';

interface RezervasyonFormuProps {
  odaTipleri: OdaTipi[];
  otelId: number;
  onRezervasyonTamamla?: (data: any) => void;
}

export default function RezervasyonFormu({
  odaTipleri,
  otelId,
  onRezervasyonTamamla,
}: RezervasyonFormuProps) {
  const T = useLanguage();

  const [pansiyonTipleri, setPansiyonTipleri] = useState<PansiyonTipi[]>([]);
  const [selectedOdaTipi, setSelectedOdaTipi] = useState<number | null>(null);
  const [selectedPansiyon, setSelectedPansiyon] = useState<number | null>(null);
  const [girisTarihi, setGirisTarihi] = useState('');
  const [cikisTarihi, setCikisTarihi] = useState('');
  const [odaSayisi, setOdaSayisi] = useState(1);
  const [yetiskinSayisi, setYetiskinSayisi] = useState(2);
  const [cocukSayisi, setCocukSayisi] = useState(0);
  const [bebekSayisi, setBebekSayisi] = useState(0);

  const [fiyatBilgisi, setFiyatBilgisi] = useState<FiyatHesaplama | null>(null);
  const [musaitlikBilgisi, setMusaitlikBilgisi] = useState<MusaitlikKontrol | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    loadPansiyonTipleri();
  }, []);

  useEffect(() => {
    if (selectedOdaTipi && girisTarihi && cikisTarihi) {
      checkPriceAndAvailability();
    }
  }, [selectedOdaTipi, selectedPansiyon, girisTarihi, cikisTarihi, odaSayisi]);

  const loadPansiyonTipleri = async () => {
    try {
      const data = await getAktifPansiyonTipleri();
      setPansiyonTipleri(data);
    } catch (error) {
      console.error('Pansiyon tipleri yüklenemedi:', error);
    }
  };

  const checkPriceAndAvailability = async () => {
    if (!selectedOdaTipi || !girisTarihi || !cikisTarihi) return;

    setCalculating(true);
    try {
      const [fiyat, musaitlik] = await Promise.all([
        calculateTotalPrice(
          selectedOdaTipi,
          girisTarihi,
          cikisTarihi,
          selectedPansiyon || undefined
        ),
        checkAvailability(selectedOdaTipi, girisTarihi, cikisTarihi, odaSayisi),
      ]);

      setFiyatBilgisi(fiyat);
      setMusaitlikBilgisi(musaitlik);
    } catch (error: any) {
      console.error('Hesaplama hatası:', error);
      setFiyatBilgisi(null);
      setMusaitlikBilgisi(null);
    } finally {
      setCalculating(false);
    }
  };

  const handleRezervasyon = () => {
    if (!selectedOdaTipi || !girisTarihi || !cikisTarihi) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    if (!musaitlikBilgisi?.musait) {
      alert('Seçtiğiniz tarihler için oda müsait değil');
      return;
    }

    const rezervasyonData = {
      oda_tipi_id: selectedOdaTipi,
      pansiyon_tipi_id: selectedPansiyon,
      giris_tarihi: girisTarihi,
      cikis_tarihi: cikisTarihi,
      oda_sayisi: odaSayisi,
      yetiskin_sayisi: yetiskinSayisi,
      cocuk_sayisi: cocukSayisi,
      bebek_sayisi: bebekSayisi,
      toplam_fiyat: fiyatBilgisi?.toplam_fiyat || 0,
      gece_sayisi: fiyatBilgisi?.gece_sayisi || 0,
    };

    if (onRezervasyonTamamla) {
      onRezervasyonTamamla(rezervasyonData);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">
        {T.reservation?.title || 'Rezervasyon Yap'}
      </h2>

      {/* Tarih Seçimi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {T.reservation?.check_in || 'Giriş Tarihi'}
          </label>
          <input
            type="date"
            min={today}
            value={girisTarihi}
            onChange={(e) => setGirisTarihi(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {T.reservation?.check_out || 'Çıkış Tarihi'}
          </label>
          <input
            type="date"
            min={girisTarihi || today}
            value={cikisTarihi}
            onChange={(e) => setCikisTarihi(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Oda Tipi Seçimi */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          {T.reservation?.room_type || 'Oda Tipi'}
        </label>
        <select
          value={selectedOdaTipi || ''}
          onChange={(e) => setSelectedOdaTipi(Number(e.target.value) || null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{T.reservation?.select_room || 'Oda Tipi Seçin'}</option>
          {odaTipleri
            .filter((oda) => oda.durum === 1)
            .map((oda) => (
              <option key={oda.id} value={oda.id}>
                {oda.ad} - {oda.yetiskin_kapasite} Yetişkin, {oda.cocuk_kapasite}{' '}
                Çocuk
                {oda.fiyat && ` - ${oda.fiyat.toLocaleString('tr-TR')} ₺/gece`}
              </option>
            ))}
        </select>
      </div>

      {/* Pansiyon Tipi Seçimi */}
      {pansiyonTipleri.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {T.reservation?.board_type || 'Pansiyon Tipi'}
          </label>
          <select
            value={selectedPansiyon || ''}
            onChange={(e) => setSelectedPansiyon(Number(e.target.value) || null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">
              {T.reservation?.select_board || 'Pansiyon Seçin'}
            </option>
            {pansiyonTipleri.map((pansiyon) => (
              <option key={pansiyon.id} value={pansiyon.id}>
                {pansiyon.ad} ({pansiyon.kod})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Misafir Bilgileri */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {T.reservation?.rooms || 'Oda Sayısı'}
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={odaSayisi}
            onChange={(e) => setOdaSayisi(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {T.reservation?.adults || 'Yetişkin'}
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={yetiskinSayisi}
            onChange={(e) => setYetiskinSayisi(parseInt(e.target.value) || 2)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {T.reservation?.children || 'Çocuk'}
          </label>
          <input
            type="number"
            min="0"
            max="5"
            value={cocukSayisi}
            onChange={(e) => setCocukSayisi(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {T.reservation?.infants || 'Bebek'}
          </label>
          <input
            type="number"
            min="0"
            max="3"
            value={bebekSayisi}
            onChange={(e) => setBebekSayisi(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Fiyat ve Müsaitlik Bilgisi */}
      {calculating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="animate-pulse text-blue-700 text-center">
            {T.reservation?.calculating || 'Fiyat hesaplanıyor...'}
          </div>
        </div>
      )}

      {!calculating && fiyatBilgisi && musaitlikBilgisi && (
        <div className="space-y-4 mb-6">
          {/* Müsaitlik Durumu */}
          <div
            className={`border rounded-lg p-4 ${
              musaitlikBilgisi.musait
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`font-medium ${
                    musaitlikBilgisi.musait ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {musaitlikBilgisi.musait
                    ? '✓ Oda Müsait'
                    : '✗ Oda Müsait Değil'}
                </p>
                <p
                  className={`text-sm ${
                    musaitlikBilgisi.musait ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {musaitlikBilgisi.mesaj}
                </p>
              </div>
            </div>
          </div>

          {/* Fiyat Bilgisi */}
          {musaitlikBilgisi.musait && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="mb-3">
                <span className="text-sm text-blue-700 block mb-2">
                  {fiyatBilgisi.gece_sayisi} {T.reservation?.nights || 'Gece'}
                </span>
                <PriceConverter
                  fiyat={fiyatBilgisi.toplam_fiyat}
                  kaynakBirim="TRY"
                  gosterilecekBirimler={['USD', 'EUR']}
                />
              </div>

              {/* Günlük Fiyat Detayları */}
              <details className="text-sm">
                <summary className="cursor-pointer text-blue-700 hover:text-blue-900">
                  {T.reservation?.price_breakdown || 'Fiyat Detayları'}
                </summary>
                <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
                  {fiyatBilgisi.gunluk_fiyatlar.map((gun, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-blue-800 py-1"
                    >
                      <span>{new Date(gun.tarih).toLocaleDateString('tr-TR')}</span>
                      <span className="font-medium">
                        {gun.fiyat.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Rezervasyon Butonu */}
      <button
        onClick={handleRezervasyon}
        disabled={
          !selectedOdaTipi ||
          !girisTarihi ||
          !cikisTarihi ||
          !musaitlikBilgisi?.musait ||
          calculating
        }
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
          !selectedOdaTipi ||
          !girisTarihi ||
          !cikisTarihi ||
          !musaitlikBilgisi?.musait ||
          calculating
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {calculating
          ? T.reservation?.calculating || 'Hesaplanıyor...'
          : T.reservation?.book_now || 'Rezervasyon Yap'}
      </button>

      {/* Uyarılar */}
      {!girisTarihi && !cikisTarihi && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          {T.reservation?.select_dates || 'Lütfen giriş ve çıkış tarihlerini seçin'}
        </p>
      )}
    </div>
  );
}

