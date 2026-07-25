CREATE TABLE IF NOT EXISTS vehicles (
  id INT NOT NULL AUTO_INCREMENT,
  organization_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  license_plate VARCHAR(20) DEFAULT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_vehicles_organization (organization_id),
  CONSTRAINT uq_vehicles_organization_name
    UNIQUE (organization_id, name),
  CONSTRAINT uq_vehicles_organization_license_plate
    UNIQUE (organization_id, license_plate),
  CONSTRAINT fk_vehicles_organization
    FOREIGN KEY (organization_id)
    REFERENCES organizations (id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
