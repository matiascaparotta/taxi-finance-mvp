ALTER TABLE organization_memberships
  ADD COLUMN settlement_mode
    ENUM('NONE', 'MONTHLY_50_50', 'DAILY_50_50')
    NOT NULL DEFAULT 'NONE'
    AFTER daily_social_security,
  ADD COLUMN driver_share_basis_points SMALLINT UNSIGNED
    NOT NULL DEFAULT 0
    AFTER settlement_mode
