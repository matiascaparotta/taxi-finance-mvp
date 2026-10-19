ALTER TABLE daily_settlement_snapshots
  ADD COLUMN owner_adjustment_breakdown JSON DEFAULT NULL
  AFTER owner_adjustment;
