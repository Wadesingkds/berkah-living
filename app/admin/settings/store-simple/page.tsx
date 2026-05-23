"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { saveStoreSettings } from "./actions";

interface StoreSettings {
  store_name: string;
  store_phone: string;
  store_email: string;
  store_address: string;
  whatsapp_number: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
}

export default function StoreSettingsSimplePage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: "",
    store_phone: "",
    store_email: "",
    store_address: "",
    whatsapp_number: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings/store")
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          store_name: data.store_name || "",
          store_phone: data.store_phone || "",
          store_email: data.store_email || "",
          store_address: data.store_address || "",
          whatsapp_number: data.whatsapp_number || "",
          bank_name: data.bank_name || "",
          bank_account_number: data.bank_account_number || "",
          bank_account_name: data.bank_account_name || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (
    field: keyof StoreSettings,
    value: string
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Pengaturan Toko</h1>
      </div>

      <form action={saveStoreSettings} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Toko</label>
          <input
            type="text"
            name="store_name"
            value={settings.store_name}
            onChange={(e) => handleChange("store_name", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
          <input
            type="text"
            name="store_phone"
            value={settings.store_phone}
            onChange={(e) => handleChange("store_phone", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="store_email"
            value={settings.store_email}
            onChange={(e) => handleChange("store_email", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Alamat Toko</label>
          <textarea
            name="store_address"
            value={settings.store_address}
            onChange={(e) => handleChange("store_address", e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nomor WhatsApp</label>
          <input
            type="text"
            name="whatsapp_number"
            value={settings.whatsapp_number}
            onChange={(e) => handleChange("whatsapp_number", e.target.value)}
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
                name="bank_name"
                value={settings.bank_name}
                onChange={(e) => handleChange("bank_name", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nomor Rekening</label>
              <input
                type="text"
                name="bank_account_number"
                value={settings.bank_account_number}
                onChange={(e) => handleChange("bank_account_number", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nama Pemilik Rekening</label>
              <input
                type="text"
                name="bank_account_name"
                value={settings.bank_account_name}
                onChange={(e) => handleChange("bank_account_name", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Save size={16} />
          Simpan Pengaturan
        </button>
      </form>
    </div>
  );
}
