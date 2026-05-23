import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Return default settings for now
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
    
    // For now, just return success
    // TODO: Save to Supabase when service role key is available
    console.log("Store settings received:", body);
    
    return NextResponse.json({
      success: true,
      message: "Settings saved (local storage only for now)",
      data: body,
    });
  } catch (error) {
    console.error("Error saving store settings:", error);
    return NextResponse.json(
      { error: "Failed to save store settings" },
      { status: 500 }
    );
  }
}
