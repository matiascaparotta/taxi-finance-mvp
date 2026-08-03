ALTER TABLE organization_memberships
  ADD COLUMN daily_social_security DECIMAL(10, 2) NOT NULL DEFAULT 0.00
  AFTER fuel_rate_per_km;
