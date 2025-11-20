-- Limpiar datos existentes
TRUNCATE TABLE public.supplement_doses CASCADE;
TRUNCATE TABLE public.supplements CASCADE;

-- Insertar suplementos (VALORES CORREGIDOS: elemental_iron en mg/ml, no mg/gota)
INSERT INTO public.supplements (id_supplement, name, type, presentation, elemental_iron, content, notes)
VALUES
  ('polimaltosado-gotas-20ml', 'Complejo polimaltosado férrico', 'POLIMALTOSE', 'DROPS', 50, 20, 'Frasco de 20ml. 1ml = 50mg hierro elemental (20 gotas). Aprox 400 gotas.'),
  ('ferrimax-gotas-20ml', 'Complejo polimaltosado férrico FERRIMAX', 'POLIMALTOSE', 'DROPS', 50, 20, 'Frasco de 20ml. 1ml = 50mg hierro elemental (20 gotas). Aprox 400 gotas.'),
  ('ferrimax-gotas-30ml', 'Complejo polimaltosado férrico FERRIMAX', 'POLIMALTOSE', 'DROPS', 50, 30, 'Frasco de 30ml. 1ml = 50mg hierro elemental (20 gotas). Aprox 600 gotas.'),
  ('sulfato-ferroso-gotas-21ml', 'Sulfato ferroso en gotas (Estándar)', 'SULFATE', 'DROPS', 25, 21, 'Frasco de 21ml. 1ml = 25mg hierro elemental (20 gotas). Aprox 420 gotas.'),
  ('sulfato-ferroso-gotas-30ml', 'Sulfato ferroso en gotas (Estándar)', 'SULFATE', 'DROPS', 25, 30, 'Frasco de 30ml. 1ml = 25mg hierro elemental (20 gotas). Aprox 600 gotas.'),
  ('ferinsol-gotas-20ml', 'Ferinsol (Sulfato ferroso)', 'SULFATE', 'DROPS', 25, 20, 'Frasco de 20ml. 1ml = 25mg hierro elemental (20 gotas). Aprox 400 gotas.'),
  ('ferinsol-gotas-30ml', 'Ferinsol (Sulfato ferroso)', 'SULFATE', 'DROPS', 25, 30, 'Frasco de 30ml. 1ml = 25mg hierro elemental (20 gotas). Aprox 600 gotas.'),
  ('sulfato-ferroso-jarabe-180ml', 'Sulfato ferroso jarabe', 'SULFATE', 'SYRUP', 3.0, 180, 'Frasco de 180ml. 1ml = 3mg hierro elemental.'),
  ('sulfato-ferroso-60mg', 'Sulfato ferroso 60mg', 'SULFATE', 'TABLET', 60.0, 100, 'Blister de 100 tabletas. Para adultos sanos.'),
  ('sulfato-ferroso-120mg', 'Sulfato ferroso 120mg', 'SULFATE', 'TABLET', 120.0, 100, 'Blister de 100 tabletas. Para adultos con anemia.'),
  ('sulfato-ferroso-120mg-folico-800ug', 'Sulfato ferroso 120mg + Ácido Fólico 800µg', 'SULFATE', 'TABLET', 120.0, 100, 'Blister de 100 tabletas. Para mujeres gestantes/puérperas/anémicas.');

-- Insertar guías de dosificación (mg/kg/día según edad)
INSERT INTO public.supplement_doses (id_supplement, from_age_days, to_age_days, dose_amount)
VALUES
  -- Polimaltosado 20ml
  ('polimaltosado-gotas-20ml', 0, 180, 2.5), ('polimaltosado-gotas-20ml', 181, 730, 2.5), ('polimaltosado-gotas-20ml', 731, 1825, 3.0), ('polimaltosado-gotas-20ml', 1826, 3650, 3.0), ('polimaltosado-gotas-20ml', 3651, 5474, 3.0),
  -- Ferrimax 20ml
  ('ferrimax-gotas-20ml', 0, 180, 2.5), ('ferrimax-gotas-20ml', 181, 730, 2.5), ('ferrimax-gotas-20ml', 731, 1825, 3.0), ('ferrimax-gotas-20ml', 1826, 3650, 3.0), ('ferrimax-gotas-20ml', 3651, 5474, 3.0),
  -- Ferrimax 30ml
  ('ferrimax-gotas-30ml', 0, 180, 2.5), ('ferrimax-gotas-30ml', 181, 730, 2.5), ('ferrimax-gotas-30ml', 731, 1825, 3.0), ('ferrimax-gotas-30ml', 1826, 3650, 3.0), ('ferrimax-gotas-30ml', 3651, 5474, 3.0),
  -- Sulfato gotas 21ml
  ('sulfato-ferroso-gotas-21ml', 0, 180, 2.5), ('sulfato-ferroso-gotas-21ml', 181, 730, 2.5), ('sulfato-ferroso-gotas-21ml', 731, 1825, 3.0), ('sulfato-ferroso-gotas-21ml', 1826, 3650, 3.0), ('sulfato-ferroso-gotas-21ml', 3651, 5474, 3.0),
  -- Sulfato gotas 30ml
  ('sulfato-ferroso-gotas-30ml', 0, 180, 2.5), ('sulfato-ferroso-gotas-30ml', 181, 730, 2.5), ('sulfato-ferroso-gotas-30ml', 731, 1825, 3.0), ('sulfato-ferroso-gotas-30ml', 1826, 3650, 3.0), ('sulfato-ferroso-gotas-30ml', 3651, 5474, 3.0),
  -- Ferinsol 20ml
  ('ferinsol-gotas-20ml', 0, 180, 2.5), ('ferinsol-gotas-20ml', 181, 730, 2.5), ('ferinsol-gotas-20ml', 731, 1825, 3.0), ('ferinsol-gotas-20ml', 1826, 3650, 3.0), ('ferinsol-gotas-20ml', 3651, 5474, 3.0),
  -- Ferinsol 30ml
  ('ferinsol-gotas-30ml', 0, 180, 2.5), ('ferinsol-gotas-30ml', 181, 730, 2.5), ('ferinsol-gotas-30ml', 731, 1825, 3.0), ('ferinsol-gotas-30ml', 1826, 3650, 3.0), ('ferinsol-gotas-30ml', 3651, 5474, 3.0),
  -- Jarabe 180ml
  ('sulfato-ferroso-jarabe-180ml', 0, 180, 2.5), ('sulfato-ferroso-jarabe-180ml', 181, 730, 2.5), ('sulfato-ferroso-jarabe-180ml', 731, 1825, 3.0), ('sulfato-ferroso-jarabe-180ml', 1826, 3650, 3.0), ('sulfato-ferroso-jarabe-180ml', 3651, 5474, 3.0),
  -- Adultos (15+ años)
  ('sulfato-ferroso-60mg', 5475, 36500, 1.0), ('sulfato-ferroso-120mg', 5475, 36500, 1.0), ('sulfato-ferroso-120mg-folico-800ug', 5475, 36500, 1.0);

-- Verificar inserción
SELECT s.id_supplement, s.name, s.presentation, s.elemental_iron, s.content, COUNT(sd.dose_id) as guidelines
FROM public.supplements s
LEFT JOIN public.supplement_doses sd ON s.id_supplement = sd.id_supplement
GROUP BY s.id_supplement, s.name, s.presentation, s.elemental_iron, s.content
ORDER BY s.presentation, s.name;
