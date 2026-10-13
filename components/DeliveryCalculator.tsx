'use client';

import React, { useState } from 'react';
import { Truck, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/lib/site';

const DISTRICT_TIERS: Record<string, { fee: number; eta: string; tier: string }> = {
  // Kathmandu Valley (Rs. 100 / 24–48h)
  Kathmandu: { fee: 100, eta: '24–48 hours (Same/Next Day)', tier: 'Valley' },
  Lalitpur: { fee: 100, eta: '24–48 hours (Same/Next Day)', tier: 'Valley' },
  Bhaktapur: { fee: 100, eta: '24–48 hours (Same/Next Day)', tier: 'Valley' },

  // Major Cities (Rs. 150 / 2–4 days)
  Kaski: { fee: 150, eta: '2–3 business days (Pokhara Express)', tier: 'Major City' },
  Chitwan: { fee: 150, eta: '2–3 business days (Bharatpur)', tier: 'Major City' },
  Rupandehi: { fee: 150, eta: '2–3 business days (Butwal/Bhairahawa)', tier: 'Major City' },
  Morang: { fee: 150, eta: '2–4 business days (Biratnagar)', tier: 'Major City' },
  Sunsari: { fee: 150, eta: '2–4 business days (Dharan/Itahari)', tier: 'Major City' },
  Jhapa: { fee: 150, eta: '2–4 business days (Birtamod/Damak)', tier: 'Major City' },
  Makwanpur: { fee: 150, eta: '2–3 business days (Hetauda)', tier: 'Major City' },
  Banke: { fee: 150, eta: '2–4 business days (Nepalgunj)', tier: 'Major City' },
  Surkhet: { fee: 150, eta: '3–4 business days (Birendranagar)', tier: 'Major City' },
  Kailali: { fee: 150, eta: '3–4 business days (Dhangadhi)', tier: 'Major City' },
  Kanchanpur: { fee: 150, eta: '3–4 business days (Mahendranagar)', tier: 'Major City' },
  Dhanusha: { fee: 150, eta: '2–4 business days (Janakpur)', tier: 'Major City' },
  Parsa: { fee: 150, eta: '2–4 business days (Birgunj)', tier: 'Major City' },
  Kavrepalanchok: { fee: 150, eta: '1–2 business days (Banepa/Dhulikhel)', tier: 'Major City' },
};

const DEFAULT_OTHER_DISTRICT = {
  fee: 200,
  eta: '3–6 business days (Courier Doorstep Delivery)',
  tier: 'All Nepal',
};

const ALL_77_DISTRICTS = [
  'Kathmandu',
  'Lalitpur',
  'Bhaktapur',
  'Kaski (Pokhara)',
  'Chitwan',
  'Rupandehi (Butwal)',
  'Morang (Biratnagar)',
  'Sunsari (Dharan)',
  'Jhapa',
  'Makwanpur (Hetauda)',
  'Banke (Nepalgunj)',
  'Surkhet',
  'Kailali (Dhangadhi)',
  'Kanchanpur',
  'Dhanusha (Janakpur)',
  'Parsa (Birgunj)',
  'Kavrepalanchok',
  'Achham',
  'Arghakhanchi',
  'Baglung',
  'Baitadi',
  'Bajhang',
  'Bajura',
  'Bardiya',
  'Bhojpur',
  'Dadeldhura',
  'Dailekh',
  'Dang',
  'Darchula',
  'Dhading',
  'Dhankuta',
  'Dolakha',
  'Dolpa',
  'Doti',
  'Gorkha',
  'Gulmi',
  'Humla',
  'Ilam',
  'Jajarkot',
  'Jumla',
  'Kalikot',
  'Kapilvastu',
  'Khotang',
  'Lamjung',
  'Mahottari',
  'Manang',
  'Mustang',
  'Mugu',
  'Myagdi',
  'Nawalpur',
  'Parasi',
  'Nuwakot',
  'Okhaldhunga',
  'Palpa',
  'Panchthar',
  'Parbat',
  'Pyuthan',
  'Ramechhap',
  'Rasuwa',
  'Rautahat',
  'Rolpa',
  'Rukum East',
  'Rukum West',
  'Salyan',
  'Sankhuwasabha',
  'Saptari',
  'Sarlahi',
  'Sindhuli',
  'Sindhupalchok',
  'Siraha',
  'Solukhumbu',
  'Syangja',
  'Tanahun',
  'Taplejung',
  'Tehrathum',
  'Udayapur',
];

export default function DeliveryCalculator() {
  const [selectedDistrict, setSelectedDistrict] = useState('Kathmandu');

  // Strip parentheses for mapping lookup
  const baseKey = selectedDistrict.split(' ')[0];
  const rateInfo = DISTRICT_TIERS[baseKey] || DEFAULT_OTHER_DISTRICT;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE3D6] shadow-sm space-y-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#1A3826]" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A3826]">
            77-District Delivery &amp; COD Calculator
          </h4>
        </div>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          COD Available ✅
        </span>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="district-select" className="block text-[11px] font-medium text-stone-600">
          Select Your Delivery District in Nepal:
        </label>
        <select
          id="district-select"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-xs text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3826] cursor-pointer"
        >
          {ALL_77_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
        <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6]">
          <span className="block text-[10px] text-stone-500 font-medium">Standard Delivery Fee:</span>
          <span className="font-bold text-[#1A3826]">
            Rs. {rateInfo.fee}
          </span>
          <span className="block text-[9px] text-emerald-700 font-semibold mt-0.5">
            Free over Rs. 3,000
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6]">
          <span className="block text-[10px] text-stone-500 font-medium">Estimated Transit Time:</span>
          <span className="font-bold text-[#1A3826] leading-tight block text-[11px]">
            {rateInfo.eta}
          </span>
        </div>
      </div>

      <div className="text-[10px] text-stone-500 flex items-center justify-between border-t border-stone-100 pt-2">
        <span>Payment: Cash on Delivery, eSewa, FonePay QR</span>
        <span className="font-semibold text-[#1A3826]">Direct Baneshwor Dispatch</span>
      </div>
    </div>
  );
}
