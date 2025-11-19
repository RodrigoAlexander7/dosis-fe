-- Limpiar tablas existentes
TRUNCATE TABLE public.supplement_doses CASCADE;
TRUNCATE TABLE public.supplements CASCADE;

-- Insertar datos en la tabla supplements
INSERT INTO public.supplements (id_supplement, name, type, presentation, elemental_iron, content, notes, created_at)
VALUES
  -- === SUPLEMENTOS PEDIÁTRICOS (GOTAS Y JARABES) ===
  
  -- 1. Complejo polimaltosado férrico (gotas) - 20ml
  (
    'polimaltosado-gotas-20ml', 
    'Complejo polimaltosado férrico', 
    'POLIMALTOSE', 
    'DROPS', 
    2.5, 
    20, 
    'Frasco de 20ml. 1 gota = 2.5mg hierro elemental. (400 gotas aprox)',
    NOW()
  ),
  
  -- 2. Ferrimax (gotas) - 20ml
  (
    'ferrimax-gotas-20ml', 
    'Complejo polimaltosado férrico FERRIMAX', 
    'POLIMALTOSE', 
    'DROPS', 
    2.5, 
    20, 
    'Frasco de 20ml. 1 gota = 2.5mg hierro elemental. (400 gotas aprox)',
    NOW()
  ),

  -- 3. Ferrimax (gotas) - 30ml
  (
    'ferrimax-gotas-30ml', 
    'Complejo polimaltosado férrico FERRIMAX', 
    'POLIMALTOSE', 
    'DROPS', 
    2.5, 
    30, 
    'Frasco de 30ml. 1 gota = 2.5mg hierro elemental. (600 gotas aprox)',
    NOW()
  ),

  -- 4. Sulfato ferroso estándar (gotas) - 21ml
  (
    'sulfato-ferroso-gotas-21ml', 
    'Sulfato ferroso en gotas (Estándar)', 
    'SULFATE', 
    'DROPS', 
    1.25, 
    21, 
    'Frasco de 21ml. 1 gota = 1.25mg hierro elemental. (400 gotas aprox)',
    NOW()
  ),

  -- 5. Sulfato ferroso estándar (gotas) - 30ml
  (
    'sulfato-ferroso-gotas-30ml', 
    'Sulfato ferroso en gotas (Estándar)', 
    'SULFATE', 
    'DROPS', 
    1.25, 
    30, 
    'Frasco de 30ml. 1 gota = 1.25mg hierro elemental. (600 gotas aprox)',
    NOW()
  ),

  -- 6. Ferinsol (gotas) - 20ml
  (
    'ferinsol-gotas-20ml', 
    'Ferinsol (Sulfato ferroso)', 
    'SULFATE', 
    'DROPS', 
    1.25, 
    20, 
    'Frasco de 20ml. 1 gota = 1.25mg hierro elemental. (400 gotas aprox)',
    NOW()
  ),

  -- 7. Ferinsol (gotas) - 30ml
  (
    'ferinsol-gotas-30ml', 
    'Ferinsol (Sulfato ferroso)', 
    'SULFATE', 
    'DROPS', 
    1.25, 
    30, 
    'Frasco de 30ml. 1 gota = 1.25mg hierro elemental. (600 gotas aprox)',
    NOW()
  ),

  -- 8. Sulfato ferroso jarabe - 180ml
  (
    'sulfato-ferroso-jarabe-180ml', 
    'Sulfato ferroso jarabe', 
    'SULFATE', 
    'SYRUP', 
    3.0, 
    180, 
    'Frasco de 180ml. 1 ml = 3mg hierro elemental.',
    NOW()
  ),

  -- === SUPLEMENTOS PARA ADULTOS (TABLETAS) ===

  -- 9. Sulfato ferroso 60mg (hombres y mujeres sanas)
  (
    'sulfato-ferroso-60mg',
    'Tabletas de Sulfato Ferroso 60mg',
    'SULFATE',
    'TABLET',
    60,
    100,
    'Blister de 100 tabletas. Cada tableta contiene 60mg de hierro elemental. Para adultos sanos.',
    NOW()
  ),

  -- 10. Sulfato ferroso 120mg (adultos con anemia)
  (
    'sulfato-ferroso-120mg',
    'Tabletas de Sulfato Ferroso 120mg',
    'SULFATE',
    'TABLET',
    120,
    100,
    'Blister de 100 tabletas. Cada tableta contiene 120mg de hierro elemental. Para adultos con anemia.',
    NOW()
  ),

  -- 11. Sulfato ferroso 120mg + Ácido Fólico 800µg (mujeres gestantes/puérperas/anémicas)
  (
    'sulfato-ferroso-120mg-folico-800ug',
    'Tabletas de Sulfato Ferroso 120mg + Ácido Fólico 800µg',
    'SULFATE',
    'TABLET',
    120,
    100,
    'Blister de 100 tabletas. Cada tableta contiene 120mg de hierro elemental + 800µg de ácido fólico. Para mujeres gestantes, puérperas o con anemia.',
    NOW()
  );

-- Insertar guías de dosificación (supplement_doses)
INSERT INTO public.supplement_doses (id_supplement, from_age_days, to_age_days, dose_amount, created_at)
VALUES
  -- === GUÍAS PARA SUPLEMENTOS PEDIÁTRICOS ===
  -- Según normativas de salud pública: 2-3 mg/kg/día para niños

  -- Polimaltosado gotas 20ml
  ('polimaltosado-gotas-20ml', 0, 180, 2.5),      -- 0-6 meses: 2.5 mg/kg/día
  ('polimaltosado-gotas-20ml', 181, 730, 2.5),    -- 6 meses-2 años: 2.5 mg/kg/día
  ('polimaltosado-gotas-20ml', 731, 1825, 3.0),   -- 2-5 años: 3.0 mg/kg/día
  ('polimaltosado-gotas-20ml', 1826, 3650, 3.0),  -- 5-10 años: 3.0 mg/kg/día
  ('polimaltosado-gotas-20ml', 3651, 5474, 3.0),  -- 10-14 años: 3.0 mg/kg/día

  -- Ferrimax gotas 20ml
  ('ferrimax-gotas-20ml', 0, 180, 2.5),
  ('ferrimax-gotas-20ml', 181, 730, 2.5),
  ('ferrimax-gotas-20ml', 731, 1825, 3.0),
  ('ferrimax-gotas-20ml', 1826, 3650, 3.0),
  ('ferrimax-gotas-20ml', 3651, 5474, 3.0),

  -- Ferrimax gotas 30ml
  ('ferrimax-gotas-30ml', 0, 180, 2.5),
  ('ferrimax-gotas-30ml', 181, 730, 2.5),
  ('ferrimax-gotas-30ml', 731, 1825, 3.0),
  ('ferrimax-gotas-30ml', 1826, 3650, 3.0),
  ('ferrimax-gotas-30ml', 3651, 5474, 3.0),

  -- Sulfato ferroso gotas 21ml
  ('sulfato-ferroso-gotas-21ml', 0, 180, 2.5),
  ('sulfato-ferroso-gotas-21ml', 181, 730, 2.5),
  ('sulfato-ferroso-gotas-21ml', 731, 1825, 3.0),
  ('sulfato-ferroso-gotas-21ml', 1826, 3650, 3.0),
  ('sulfato-ferroso-gotas-21ml', 3651, 5474, 3.0),

  -- Sulfato ferroso gotas 30ml
  ('sulfato-ferroso-gotas-30ml', 0, 180, 2.5),
  ('sulfato-ferroso-gotas-30ml', 181, 730, 2.5),
  ('sulfato-ferroso-gotas-30ml', 731, 1825, 3.0),
  ('sulfato-ferroso-gotas-30ml', 1826, 3650, 3.0),
  ('sulfato-ferroso-gotas-30ml', 3651, 5474, 3.0),

  -- Ferinsol gotas 20ml
  ('ferinsol-gotas-20ml', 0, 180, 2.5),
  ('ferinsol-gotas-20ml', 181, 730, 2.5),
  ('ferinsol-gotas-20ml', 731, 1825, 3.0),
  ('ferinsol-gotas-20ml', 1826, 3650, 3.0),
  ('ferinsol-gotas-20ml', 3651, 5474, 3.0),

  -- Ferinsol gotas 30ml
  ('ferinsol-gotas-30ml', 0, 180, 2.5),
  ('ferinsol-gotas-30ml', 181, 730, 2.5),
  ('ferinsol-gotas-30ml', 731, 1825, 3.0),
  ('ferinsol-gotas-30ml', 1826, 3650, 3.0),
  ('ferinsol-gotas-30ml', 3651, 5474, 3.0),

  -- Sulfato ferroso jarabe 180ml
  ('sulfato-ferroso-jarabe-180ml', 0, 180, 2.5),
  ('sulfato-ferroso-jarabe-180ml', 181, 730, 2.5),
  ('sulfato-ferroso-jarabe-180ml', 731, 1825, 3.0),
  ('sulfato-ferroso-jarabe-180ml', 1826, 3650, 3.0),
  ('sulfato-ferroso-jarabe-180ml', 3651, 5474, 3.0),

  -- === GUÍAS PARA SUPLEMENTOS DE ADULTOS (15 años en adelante) ===
  -- Para adultos la dosis no es por kg, es dosis fija por tableta
  -- Usamos 1.0 como valor simbólico (el cálculo será diferente en código)

  -- Sulfato ferroso 60mg (adultos)
  ('sulfato-ferroso-60mg', 5475, 36500, 1.0),  -- 15-100 años: 1 tableta/día (sanos) o 2 tabletas/día (anémicos)

  -- Sulfato ferroso 120mg (adultos con anemia)
  ('sulfato-ferroso-120mg', 5475, 36500, 1.0),  -- 15-100 años: 1 tableta/día (sanos) o 2 tabletas/día (anémicos)

  -- Sulfato ferroso 120mg + Ácido Fólico 800µg (mujeres)
  ('sulfato-ferroso-120mg-folico-800ug', 5475, 36500, 1.0);  -- 15-100 años: 1 tableta/día (sanas) o 2 tabletas/día (anémicas/gestantes/puérperas)

-- Verificar inserción
SELECT 
  s.id_supplement,
  s.name,
  s.presentation,
  s.elemental_iron,
  s.content,
  COUNT(sd.dose_id) as dosing_guidelines_count
FROM public.supplements s
LEFT JOIN public.supplement_doses sd ON s.id_supplement = sd.id_supplement
GROUP BY s.id_supplement, s.name, s.presentation, s.elemental_iron, s.content
ORDER BY s.presentation, s.name;
