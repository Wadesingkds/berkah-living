"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "f0839015-e921-41f2-9a9e-0984029054ce";

export async function saveStoreSettings(formData: FormData) {
  try {
    const data = {
      store_name: formData.get("store_name"),
      store_description: formData.get("store_description"),
      store_phone: formData.get("store_phone"),
      store_email: formData.get("store_email"),
      store_address: formData.get("store_address"),
      opening_hours: formData.get("opening_hours"),
      closing_hours: formData.get("closing_hours"),
      whatsapp_number: formData.get("whatsapp_number"),
      is_open: formData.get("is_open") === "on",
      bank_name: formData.get("bank_name"),
      bank_account_number: formData.get("bank_account_number"),
      bank_account_name: formData.get("bank_account_name"),
    };

    const { error } = await supabase
      .from("store_settings")
      .upsert(
        {
          store_id: STORE_ID,
          ...data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "store_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    redirect("/admin/settings");
  } catch (err) {
    console.error("Error saving settings:", err);
    throw err;
  }
}
