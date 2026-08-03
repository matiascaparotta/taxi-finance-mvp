ALTER TABLE work_days
  MODIFY status ENUM('OPEN', 'CLOSED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
  DROP INDEX uq_work_days_driver_date,
  ADD COLUMN active_date DATE
    GENERATED ALWAYS AS (
      CASE
        WHEN status IN ('OPEN', 'CLOSED') THEN date
        ELSE NULL
      END
    ) STORED,
  ADD CONSTRAINT uq_work_days_driver_active_date
    UNIQUE (driver_user_id, active_date);
