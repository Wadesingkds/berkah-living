import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key if available, otherwise use anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "f0839015-e921-41f2-9a9e-0984029054ce";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("store_id", STORE_ID)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return NextResponse.json({
        store_name: "",
        store_description: "",
        store_phone: "",
        store_email: "",
        store_address: "",
        whatsapp_number: "",
        is_open: true,
        opening_hours: "08:00",
        closing_hours: "20:00",
        bank_name: "",
        bank_account_number: "",
        bank_account_name: "",
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
