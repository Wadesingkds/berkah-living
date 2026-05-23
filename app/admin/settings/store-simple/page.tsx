"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function StoreSettingsSimplePage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    store_name: "Berkah Living",
    store_phone: "08123456789",
    store_email: "berkah@example.com",
    store_address: "Jl. Contoh No. 123, Kudus, Jawa Tengah",
    whatsapp_number: "6282220205694",
    bank_name: "BNI",
    bank_account_number: "884343871",
    bank_account_name: "Didik Prasetiadi",
  });

  const handleSave = () => {
    alert("Pengaturan toko berhasil disimpan");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Pengaturan Toko</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Toko</label>
          <input
            type="text"
            value={settings.store_name}
            onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
          <input
            type="text"
            value={settings.store_phone}
            onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={settings.store_email}
            onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Alamat Toko</label>
          <textarea
            value={settings.store_address}
            onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
            className="w-full p-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nomor WhatsApp</label>
          <input
            type="text"
            value={settings.whatsapp_number}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="pt-4 border-t">
          <h2 className="text-sm font-medium mb-3">Informasi Pembayaran</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Bank</label>
              <input
                type="text"
                value={settings.bank_name}
                onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nomor Rekening</label>
              <input
                type="text"
                value={settings.bank_account_number}
                onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nama Pemilik Rekening</label>
              <input
                type="text"
                value={settings.bank_account_name}
                onChange={(e) => setSettings({ ...settings, bank_account_name: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
      >
        <Save size={16} />
        Simpan Pengaturan
      </button>
    </div>
  );
}
