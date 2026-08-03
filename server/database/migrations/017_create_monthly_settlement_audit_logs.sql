CREATE TABLE IF NOT EXISTS monthly_settlement_audit_logs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  monthly_settlement_id INT NOT NULL,
  organization_id INT NOT NULL,
  actor_user_id INT NOT NULL,
  action VARCHAR(40) NOT NULL,
  reason VARCHAR(500) NOT NULL,
  previous_data JSON NOT NULL,
  resulting_data JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_monthly_audit_settlement (
    monthly_settlement_id,
    created_at
  ),
  CONSTRAINT fk_monthly_audit_settlement
    FOREIGN KEY (monthly_settlement_id)
    REFERENCES monthly_settlements (id),
  CONSTRAINT fk_monthly_audit_organization
    FOREIGN KEY (organization_id) REFERENCES organizations (id),
  CONSTRAINT fk_monthly_audit_actor
    FOREIGN KEY (actor_user_id) REFERENCES users (id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
