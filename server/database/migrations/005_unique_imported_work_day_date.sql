ALTER TABLE monthly_work_day_imports
  ADD CONSTRAINT uq_monthly_work_day_imports_date UNIQUE (date);
