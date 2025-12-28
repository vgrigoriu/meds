-- Seed active substances
INSERT INTO `active_substances` (`id`, `name`) VALUES
  (1, 'Propionat de clobetazol'),
  (2, 'Potasiu'),
  (3, 'Magneziu'),
  (4, 'Furoat de mometazonă'),
  (5, 'Clorzoxazonă');

-- Seed medications
INSERT INTO `medications` (`id`, `name`, `presentation`, `expiration_year`, `expiration_month`) VALUES
  (1, 'Clobetazol', 'cream', 2027, 4),
  (2, 'Aspacardin', 'pill', 2027, 10),
  (3, 'Nasonex', 'spray', 2027, 4),
  (4, 'Clorzoxazonă - Richter', 'pill', 2029, 4);

-- Seed medication-substance relationships
INSERT INTO `medication_substances` (`medication_id`, `substance_id`, `concentration`) VALUES
  (1, 1, '0,5 mg/g'),
  (2, 2, '39 mg'),
  (2, 3, '12 mg'),
  (3, 4, '50 µg'),
  (4, 5, '250 mg');
