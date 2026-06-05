-- Rename sink organizer product slug (shorter URL)
UPDATE products
SET slug = 'sink-organizer'
WHERE slug = 'magic-under-sink-organizer';
