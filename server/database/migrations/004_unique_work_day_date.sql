ALTER TABLE work_days
  ADD CONSTRAINT uq_work_days_date UNIQUE (date);
