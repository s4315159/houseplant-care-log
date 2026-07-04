-- =============================================================================
--  Seed data for the demo / screenshots
-- =============================================================================
--  Inserts 10 realistic houseplants for a given user, with a spread of statuses
--  and "date added" values so the dashboard and table look authentic.
--
--  Run in: Supabase dashboard > SQL Editor > New query > paste > Run.
--  It runs with admin rights, so it bypasses Row Level Security and assigns the
--  rows to the user whose email is set below.
--
--  >>> If your login email is different, change it on the WHERE line at the end.
-- =============================================================================

insert into public.plants (user_id, name, location, status, notes, created_at)
select
  u.id,
  d.name,
  d.location,
  d.status,
  d.notes,
  now() - make_interval(days => d.days_ago)
from auth.users u
cross join (values
  ('Monstera deliciosa', 'Living room',        'Healthy',        'Water weekly, bright indirect light',        18),
  ('Snake plant',        'Bedroom',            'Dormant',        'Water monthly in winter, very hardy',        16),
  ('Peace lily',         'Kitchen',            'Needs Watering', 'Leaves drooping - water today',              14),
  ('Aloe vera',          'Kitchen windowsill', 'Healthy',        'Bright sun, water sparingly',                12),
  ('Boston fern',        'Bathroom',           'Needs Watering', 'Loves humidity, keep soil moist',            10),
  ('Golden pothos',      'Office shelf',       'Healthy',        'Very forgiving trailing vine',                8),
  ('ZZ plant',           'Hallway',            'Healthy',        'Tolerates low light, water every 2-3 weeks',  6),
  ('Spider plant',       'Living room',        'Healthy',        'Produces baby plantlets',                     4),
  ('Moth orchid',        'Bedroom windowsill', 'Needs Watering', 'Water with a few ice cubes weekly',           2),
  ('Rubber plant',       'Living room',        'Dormant',        'Wipe leaves, slow growth in winter',          1)
) as d(name, location, status, notes, days_ago)
where u.email = 'john@example.com';   -- <<< change if your login email differs
