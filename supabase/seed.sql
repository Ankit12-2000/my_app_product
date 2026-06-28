-- =====================================================================
-- Optional seed data for the Moorti Marketplace public site.
-- Run AFTER schema.sql. Uses picsum.photos placeholder images.
-- =====================================================================

insert into categories (name, slug, description, image_url) values
  ('Hindu Deities', 'hindu-deities', 'Statues of Gods & Goddesses', 'https://picsum.photos/seed/ganesh/800/800'),
  ('Buddha Statues', 'buddha-statues', 'Buddha in many poses & finishes', 'https://picsum.photos/seed/buddha/800/800'),
  ('Temple Idols', 'temple-idols', 'Large idols for temples', 'https://picsum.photos/seed/temple/800/800'),
  ('Home Decor', 'home-decor', 'Decorative statues for home', 'https://picsum.photos/seed/decor/800/800'),
  ('Garden Statues', 'garden-statues', 'Weatherproof outdoor pieces', 'https://picsum.photos/seed/garden/800/800'),
  ('Marble Murti', 'marble-murti', 'Premium marble craftsmanship', 'https://picsum.photos/seed/marble/800/800')
on conflict (slug) do nothing;

insert into materials (name, slug) values
  ('Marble', 'marble'), ('Brass', 'brass'), ('Bronze', 'bronze'),
  ('Panchdhatu', 'panchdhatu'), ('Sandstone', 'sandstone'),
  ('Fiber', 'fiber'), ('Wood', 'wood')
on conflict (slug) do nothing;

insert into shops (name, slug, tagline, description, city, state, phone, email, whatsapp, is_featured, is_approved, rating, review_count) values
  ('Jaipur Marble Arts', 'jaipur-marble-arts', 'Handcrafted marble murti since 1985',
   'Three generations of master craftsmen creating exquisite marble statues from the finest Makrana marble.',
   'Jaipur', 'Rajasthan', '+91 98290 00001', 'sales@jaipurmarble.example', '+919829000001', true, true, 4.8, 124),
  ('Moradabad Brass House', 'moradabad-brass-house', 'The brass city''s finest idols',
   'Specialists in brass and panchdhatu deities, exported worldwide.',
   'Moradabad', 'Uttar Pradesh', '+91 99270 00002', 'info@moradabadbrass.example', '+919927000002', true, true, 4.6, 89),
  ('Mahabalipuram Stone Craft', 'mahabalipuram-stone-craft', 'Temple sculptors of the south',
   'Traditional stone sculptors carving temple idols and garden statues for over 40 years.',
   'Mahabalipuram', 'Tamil Nadu', '+91 90030 00003', 'contact@mahabalistone.example', '+919003000003', false, true, 4.9, 67)
on conflict (slug) do nothing;

-- Products + images are best seeded via the app once vendor tooling exists,
-- but here is one example showing the join shape:
-- (Look up ids from shops/categories/materials when running manually.)
