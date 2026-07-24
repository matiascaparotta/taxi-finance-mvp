CREATE TABLE IF NOT EXISTS trips (
  id INT NOT NULL AUTO_INCREMENT,
  work_day_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_type ENUM('cash', 'card') NOT NULL,
  commission DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  tip DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  note VARCHAR(255) DEFAULT NULL,
  cash_adjustment DECIMAL(10, 2) DEFAULT 0.00,
  adjustment_reason VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_trips_work_day (work_day_id),
  CONSTRAINT fk_trips_work_day
    FOREIGN KEY (work_day_id)
    REFERENCES work_days (id)
    ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
