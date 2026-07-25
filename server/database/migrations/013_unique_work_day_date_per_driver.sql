ALTER TABLE work_days
  DROP INDEX uq_work_days_date,
  ADD CONSTRAINT uq_work_days_driver_date
    UNIQUE (driver_user_id, date);
