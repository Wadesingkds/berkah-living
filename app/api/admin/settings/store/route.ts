import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "f0839015-e921-41f2-9a9e-0984029054ce";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("store_id", STORE_ID)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data) {
      return NextResponse.json({
        store_name: "Berkah Living",
        store_description: "",
        store_phone: "08123456789",
        store_email: "berkah@example.com",
        store_address: "Jl. Contoh No. 123, Kudus, Jawa Tengah",
        whatsapp_number: "6282220205694",
        is_open: true,
        opening_hours: "08:00",
        closing_hours: "20:00",
        bank_name: "BNI",
        bank_account_number: "884343871",
        bank_account_name: "Didik Prasetiadi",
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching store settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch store settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("store_settings")
      .upsert(
        {
          store_id: STORE_ID,
          ...body,
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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error saving store settings:", error);
    return NextResponse.json(
      { error: "Failed to save store settings" },
      { status: 500 }
    );
  }
}
