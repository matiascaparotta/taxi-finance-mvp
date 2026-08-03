ALTER TABLE trips
  ADD COLUMN commission_company_name VARCHAR(120) DEFAULT NULL AFTER commission,
  ADD COLUMN commission_rate DECIMAL(7, 4) DEFAULT NULL AFTER commission_company_name;
