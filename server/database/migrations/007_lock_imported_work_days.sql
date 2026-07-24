UPDATE work_days AS work_day
INNER JOIN monthly_work_day_imports AS imported
  ON imported.date = work_day.date
SET work_day.is_locked = TRUE;
