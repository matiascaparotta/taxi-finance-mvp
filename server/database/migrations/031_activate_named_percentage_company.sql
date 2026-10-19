UPDATE commission_companies
SET commission_type = 'PERCENTAGE', commission_amount = 10.00
WHERE LOWER(name) LIKE '%10%';
