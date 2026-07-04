const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://cbuqlnwixthejxgnkloq.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidXFsbndpeHRoZWp4Z25rbG9xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU3NzY0MCwiZXhwIjoyMDk4MTUzNjQwfQ.G5YkTuGIJebqbbv2OZ-Qx-FOImoCk3z-ATRRFffcfL8";

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

const deities = ["Ganesh", "Krishna", "Shiva", "Durga", "Lakshmi", "Saraswati", "Hanuman", "Rama", "Sai Baba", "Jesus", "Buddha", "Radha", "Parvati", "Ganesha", "Vishnu"];
const materials = ["Marble", "Brass", "Bronze", "Wood", "Stone", "Resin", "Granite", "Copper"];
const finishes = ["White Marble", "Gold Painted", "Natural Stone", "Polished Brass", "Antique Finish", "Pearl White", "Colorful", "Black Stone", "Wood Carved", "Marble Inlay"];
const sizes = ["Small (6 inch)", "Medium (12 inch)", "Large (18 inch)", "XL (24 inch)", "XXL (36 inch)", "Small", "Medium", "Large"];

const cities = ["Jaipur", "Udaipur", "Jodhpur", "Pushkar", "Agra", "Delhi", "Mumbai", "Varanasi"];

const products = [];
for (let i = 0; i < 30; i++) {
  const deity = deities[i % deities.length];
  const material = materials[i % materials.length];
  const finish = finishes[i % finishes.length];
  const size = sizes[i % sizes.length];
  const city = cities[i % cities.length];
  const priceMin = 2000 + Math.floor(Math.random() * 15000);
  const priceMax = priceMin + 5000 + Math.floor(Math.random() * 30000);
  const height = 15 + Math.floor(Math.random() * 60);
  const slug = `demo-${deity.toLowerCase().replace(/\s+/g, "-")}-${material.toLowerCase()}-${i + 1}`;

  products.push({
    deity,
    material_name: material,
    finish,
    size,
    city,
    price_min: priceMin,
    price_max: priceMax,
    height_cm: height,
    name: `${deity} Statue - ${material} ${finish}`,
    slug,
    description: `Beautiful handcrafted ${deity} statue made from premium ${material.toLowerCase()} with ${finish.toLowerCase()} finish. Perfect for home temples, offices, and gifting.`,
  });
}

async function seed() {
  // Get demo shop
  const { data: shops } = await sb.from("shops").select("id").eq("slug", "demo-shop").limit(1);
  if (!shops || shops.length === 0) {
    console.error("Demo shop not found!");
    process.exit(1);
  }
  const shopId = shops[0].id;
  console.log("Shop ID:", shopId);

  // Get existing categories
  const { data: cats } = await sb.from("categories").select("id, name");
  const catMap = {};
  if (cats) cats.forEach(c => catMap[c.name.toLowerCase()] = c.id);

  // Get existing materials
  const { data: mats } = await sb.from("materials").select("id, name");
  const matMap = {};
  if (mats) mats.forEach(m => matMap[m.name.toLowerCase()] = m.id);

  // Insert products
  for (const p of products) {
    const { data: product, error } = await sb.from("products").insert({
      shop_id: shopId,
      category_id: catMap[p.deity.toLowerCase()] || null,
      material_id: matMap[p.material_name.toLowerCase()] || null,
      name: p.name,
      slug: p.slug,
      description: p.description,
      deity: p.deity,
      finish: p.finish,
      size: p.size,
      height_cm: p.height_cm,
      price_min: p.price_min,
      price_max: p.price_max,
      city: p.city,
      is_approved: true,
      in_stock: true,
    }).select().single();

    if (error) {
      console.error(`Error inserting ${p.name}:`, error.message);
    } else {
      console.log(`✓ ${p.name}`);
    }
  }

  console.log("\nDone! 30 products seeded.");
}

seed().catch(console.error);
