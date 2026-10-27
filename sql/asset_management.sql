-- Optional MySQL schema and queries for the IT Asset Management case study.
-- The provided Node.js demo currently stores data in memory; these SQL statements
-- are for the database design/query part of your lab record and are not wired into the app.

CREATE DATABASE IF NOT EXISTS it_asset_db;
USE it_asset_db;

CREATE TABLE IF NOT EXISTS assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_name VARCHAR(100) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    assigned_to VARCHAR(100),
    asset_status ENUM('Available', 'In Use', 'Under Maintenance', 'Retired')
        NOT NULL DEFAULT 'Available',
    purchase_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Add a new asset
INSERT INTO assets (asset_name, asset_type, serial_number, assigned_to, asset_status)
VALUES ('Office Laptop', 'Laptop', 'LT-1001', 'IT Team', 'Available');

-- 2. Display all assets
SELECT * FROM assets;

-- 3. Search by asset type
SELECT * FROM assets WHERE asset_type = 'Laptop';

-- 4. Find assets assigned to a particular person/team
SELECT * FROM assets WHERE assigned_to = 'IT Team';

-- 5. Count assets by status
SELECT asset_status, COUNT(*) AS total_assets
FROM assets
GROUP BY asset_status;

-- 6. Update assignment/status
UPDATE assets
SET assigned_to = 'Employee 101', asset_status = 'In Use'
WHERE serial_number = 'LT-1001';

-- 7. Find assets under maintenance
SELECT * FROM assets WHERE asset_status = 'Under Maintenance';

-- 8. Delete an asset by serial number
DELETE FROM assets WHERE serial_number = 'LT-1001';

-- 9. Find duplicate serial numbers (normally prevented by UNIQUE constraint)
SELECT serial_number, COUNT(*) AS copies
FROM assets
GROUP BY serial_number
HAVING COUNT(*) > 1;

-- 10. Count all registered assets
SELECT COUNT(*) AS total_assets FROM assets;
