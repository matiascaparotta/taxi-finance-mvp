CREATE TABLE IF NOT EXISTS correction_audit_logs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  organization_id INT NOT NULL,
  actor_user_id INT NOT NULL,
  work_day_id INT DEFAULT NULL,
  entity_type VARCHAR(40) NOT NULL,
  entity_id INT NOT NULL,
  action VARCHAR(40) NOT NULL,
  reason VARCHAR(500) NOT NULL,
  previous_data JSON NOT NULL,
  resulting_data JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_correction_audit_work_day (work_day_id, created_at),
  KEY idx_correction_audit_actor (actor_user_id, created_at),
  CONSTRAINT fk_correction_audit_organization
    FOREIGN KEY (organization_id)
    REFERENCES organizations (id),
  CONSTRAINT fk_correction_audit_actor
    FOREIGN KEY (actor_user_id)
    REFERENCES users (id),
  CONSTRAINT fk_correction_audit_work_day
    FOREIGN KEY (work_day_id)
    REFERENCES work_days (id)
    ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
