UPDATE public."CPU" SET stock = FLOOR(RANDOM() * 21)::int
WHERE lithography IN ('3 nm','4 nm','5 nm','7 nm','10 nm');

UPDATE public."GPU" SET stock = FLOOR(RANDOM() * 21)::int
WHERE memory_type IN ('GDDR7','GDDR6X','GDDR6');

UPDATE public."Motherboard" SET stock = FLOOR(RANDOM() * 21)::int
WHERE socket IN ('LGA1851','AM5','LGA1700','AM4');

UPDATE public."Memory" SET stock = FLOOR(RANDOM() * 21)::int
WHERE form_factor ILIKE '%DDR5%' OR form_factor ILIKE '%DDR4%';

UPDATE public."PSU" SET stock = FLOOR(RANDOM() * 21)::int
WHERE efficiency IN ('80+ Titanium','80+ Platinum','80+ Gold')
  AND CAST(REGEXP_REPLACE(COALESCE(wattage,'0'), '[^0-9]', '', 'g') AS INTEGER) >= 500;

UPDATE public."Case" SET stock = FLOOR(RANDOM() * 21)::int
WHERE type ILIKE '%Mini ITX%' OR type ILIKE '%MicroATX%' OR type = 'ATX Mid Tower';

UPDATE public."CPU Cooler" SET stock = FLOOR(RANDOM() * 21)::int
WHERE cpu_socket ILIKE '%AM4%' OR cpu_socket ILIKE '%AM5%'
   OR cpu_socket ILIKE '%LGA1700%' OR cpu_socket ILIKE '%LGA1851%';

UPDATE public."Internal Drive" SET stock = FLOOR(RANDOM() * 21)::int
WHERE interface LIKE 'M.2 PCIe 5.0%' OR interface LIKE 'M.2 PCIe 4.0%' OR interface LIKE 'M.2 PCIe 3.0%';
