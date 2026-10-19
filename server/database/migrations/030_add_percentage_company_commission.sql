ALTER TABLE commission_companies
  ADD COLUMN commission_type ENUM('FIXED', 'PERCENTAGE') NOT NULL DEFAULT 'FIXED'
  AFTER name;
