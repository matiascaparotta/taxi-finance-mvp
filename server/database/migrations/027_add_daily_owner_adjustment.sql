ALTER TABLE daily_settlement_snapshots
  ADD COLUMN owner_adjustment DECIMAL(10, 2) NOT NULL DEFAULT 0
  AFTER driver_entitlement;
