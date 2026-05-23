import { supabaseServer } from "@/lib/supabase/server";
import { CatalogClient } from "./catalog-client";

async function getStoreSettings() {
  try {
    const { data, error } = await supabaseServer
      .from("store_settings")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching store settings:", error);
      throw error;
    }

    if (!data) {
      // Return default settings if no store settings found
      return {
        id: "default",
        store_name: "Berkah Living",
        store_description: "Ayam Organik & Daging Segar",
        store_address: "Kudus, Jawa Tengah",
        opening_hours: "06:00",
        closing_hours: "18:00",
        is_open: true,
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch store settings:", error);
    // Return default settings on error
    return {
      id: "default",
      store_name: "Berkah Living",
      store_description: "Ayam Organik & Daging Segar",
      store_address: "Kudus, Jawa Tengah",
      opening_hours: "06:00",
      closing_hours: "18:00",
      is_open: true,
    };
  }
}

async function getProducts() {
  try {
    const { data, error } = await supabaseServer
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function CatalogPage() {
  // Parallel fetch - both requests run simultaneously
  const [storeSettings, products] = await Promise.all([
    getStoreSettings(),
    getProducts(),
  ]);

  return (
    <CatalogClient
      storeSettings={storeSettings}
      products={products}
    />
  );
}