UPDATE organization_memberships
INNER JOIN organizations
  ON organizations.id = organization_memberships.organization_id
INNER JOIN users
  ON users.id = organization_memberships.user_id
SET
  organization_memberships.settlement_mode = CASE
    WHEN organizations.slug = 'lic249'
      AND users.username = 'mati.caparotta'
      THEN 'MONTHLY_50_50'
    WHEN organizations.slug = 'lic1315'
      AND users.username = 'alberto.caparotta'
      THEN 'DAILY_50_50'
    ELSE organization_memberships.settlement_mode
  END,
  organization_memberships.driver_share_basis_points = CASE
    WHEN organizations.slug = 'lic249'
      AND users.username = 'mati.caparotta'
      THEN 5000
    WHEN organizations.slug = 'lic1315'
      AND users.username = 'alberto.caparotta'
      THEN 5000
    ELSE organization_memberships.driver_share_basis_points
  END,
  organization_memberships.fuel_calculation_mode = CASE
    WHEN organizations.slug = 'lic1315'
      AND users.username = 'alberto.caparotta'
      THEN 'ACTUAL_LOAD'
    ELSE organization_memberships.fuel_calculation_mode
  END,
  organization_memberships.fuel_rate_per_km = CASE
    WHEN organizations.slug = 'lic1315'
      AND users.username = 'alberto.caparotta'
      THEN NULL
    ELSE organization_memberships.fuel_rate_per_km
  END
