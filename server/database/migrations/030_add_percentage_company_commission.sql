ALTER TABLE commission_companies
  ADD COLUMN commission_type ENUM('FIXED', 'PERCENTAGE') NOT NULL DEFAULT 'FIXED'
  AFTER name;

UPDATE commission_companies
SET commission_type = 'PERCENTAGE', commission_amount = 10.00
WHERE LOWER(name) LIKE '%10%';
