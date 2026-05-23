"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function StoreSettingsSimplePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    store_name: "",
    store_phone: "",
    store_email: "",
    store_address: "",
    whatsapp_number: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
  });

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings/store");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    alert("Save clicked!");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Berhasil disimpan! Redirect ke settings...");
        window.location.href = "/admin/settings";
      } else {
        alert("Gagal: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Unknown"));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Wrap in setTimeout to avoid calling setState synchronously in effect
    setTimeout(() => {
      fetchSettings();
    }, 0);
  }, []);

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
        disabled={saving}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
        {saving ? "Menyimpan..." : "Simpan Pengaturan"}
      </button>
    </div>
  );
}
