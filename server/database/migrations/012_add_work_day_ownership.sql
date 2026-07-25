ALTER TABLE work_days
  ADD COLUMN organization_id INT DEFAULT NULL
    AFTER is_locked,
  ADD COLUMN driver_user_id INT DEFAULT NULL
    AFTER organization_id,
  ADD COLUMN vehicle_id INT DEFAULT NULL
    AFTER driver_user_id,
  ADD KEY idx_work_days_organization (organization_id),
  ADD KEY idx_work_days_driver (driver_user_id),
  ADD KEY idx_work_days_vehicle (vehicle_id),
  ADD CONSTRAINT fk_work_days_organization
    FOREIGN KEY (organization_id)
    REFERENCES organizations (id),
  ADD CONSTRAINT fk_work_days_driver
    FOREIGN KEY (driver_user_id)
    REFERENCES users (id),
  ADD CONSTRAINT fk_work_days_vehicle
    FOREIGN KEY (vehicle_id)
    REFERENCES vehicles (id);
