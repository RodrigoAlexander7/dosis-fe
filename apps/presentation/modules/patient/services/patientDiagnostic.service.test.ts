/**
 * Test para verificar el fix del bug de diagnóstico de anemia
 * Bug: Pacientes con edad exacta igual al límite saltaban a la siguiente categoría
 * Fix: Cambiar comparación < a <= en todas las validaciones de edad
 */

import { calculateDiagnostic } from './patientDiagnostic.service';
import dayjs from 'dayjs';

describe('patientDiagnostic.service - Edge Cases', () => {
   const currentDate = dayjs('2025-12-21'); // Fecha actual del reporte del bug

   beforeAll(() => {
      // Mock dayjs() para que siempre retorne la fecha de prueba
      jest.spyOn(dayjs, 'prototype' as any).mockReturnValue(currentDate);
   });

   describe('Bug Fix: Pacientes con edad exacta en el límite', () => {
      test('Bebé de exactamente 180 días (6 meses) debe usar regla de 6 meses, no 2 años', () => {
         // 24 de junio de 2025 → 180 días al 21 de diciembre de 2025
         const birthDate = '2025-06-24';
         const hb = '8.0'; // HB que debería dar "Anemia" según regla de 6 meses
         
         const result = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hb,
            '0'
         );

         // Según la regla de 6 meses: anemiaLimit: 9.49
         // HB 8.0 <= 9.49 → "Anemia"
         expect(result).toBe('Anemia');
         expect(result).not.toBe('Anemia Severa'); // No debe usar regla de 2 años
      });

      test('Bebé de 179 días debe usar regla de 6 meses', () => {
         // 25 de junio de 2025 → 179 días al 21 de diciembre de 2025
         const birthDate = '2025-06-25';
         const hb = '8.0';
         
         const result = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hb,
            '0'
         );

         expect(result).toBe('Anemia');
      });

      test('Bebé de 181 días debe usar regla de 2 años', () => {
         // 23 de junio de 2025 → 181 días al 21 de diciembre de 2025
         const birthDate = '2025-06-23';
         const hbSevera = '6.5'; // Menor a 6.99 → Anemia Severa
         const hbModerada = '8.0'; // Entre 6.99 y 9.40 → Anemia Moderada
         
         const resultSevera = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hbSevera,
            '0'
         );

         const resultModerada = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hbModerada,
            '0'
         );

         expect(resultSevera).toBe('Anemia Severa');
         expect(resultModerada).toBe('Anemia Moderada');
      });
   });

   describe('Límites exactos en otras categorías', () => {
      test('Bebé de exactamente 7 días debe usar regla de 1 semana', () => {
         const birthDate = dayjs(currentDate).subtract(7, 'days').format('YYYY-MM-DD');
         const hb = '12.0'; // Menor a 13 → Anemia
         
         const result = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hb,
            '0'
         );

         expect(result).toBe('Anemia');
      });

      test('Bebé de exactamente 28 días debe usar regla de 4 semanas', () => {
         const birthDate = dayjs(currentDate).subtract(28, 'days').format('YYYY-MM-DD');
         const hb = '9.5'; // Menor a 10 → Anemia
         
         const result = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hb,
            '0'
         );

         expect(result).toBe('Anemia');
      });

      test('Niño de exactamente 2 años debe usar regla de 2 años', () => {
         const birthDate = dayjs(currentDate).subtract(2, 'years').format('YYYY-MM-DD');
         const hb = '10.0'; // Entre 9.40 y 10.40 → Anemia Leve
         
         const result = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hb,
            '0'
         );

         expect(result).toBe('Anemia Leve');
      });

      test('Niño de exactamente 5 años debe usar regla de 5 años', () => {
         const birthDate = dayjs(currentDate).subtract(5, 'years').format('YYYY-MM-DD');
         const hb = '10.5'; // Entre 9.90 y 10.90 → Anemia Leve
         
         const result = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hb,
            '0'
         );

         expect(result).toBe('Anemia Leve');
      });

      test('Niño de exactamente 12 años debe usar regla de 12 años', () => {
         const birthDate = dayjs(currentDate).subtract(12, 'years').format('YYYY-MM-DD');
         const hb = '11.0'; // Entre 10.90 y 11.40 → Anemia Leve
         
         const result = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hb,
            '0'
         );

         expect(result).toBe('Anemia Leve');
      });

      test('Hombre de exactamente 15 años debe usar regla de adulto', () => {
         const birthDate = dayjs(currentDate).subtract(15, 'years').format('YYYY-MM-DD');
         const hb = '12.5'; // Entre 10.90 y 12.90 → Anemia Leve
         
         const result = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hb,
            '0'
         );

         expect(result).toBe('Anemia Leve');
      });
   });

   describe('Casos con hemoglobina ajustada', () => {
      test('Debe restar correctamente el ajuste de altitud', () => {
         const birthDate = '2025-06-24'; // 180 días
         const hbObservada = '10.0';
         const ajusteAltitud = '0.5';
         
         // HB ajustada = 10.0 - 0.5 = 9.5
         // 9.5 > 9.49 → Paciente Sano
         const result = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hbObservada,
            ajusteAltitud
         );

         expect(result).toBe('Paciente Sano');
      });

      test('Caso reportado: 24 junio con HB que da anemia', () => {
         const birthDate = '2025-06-24';
         const hb = '9.0'; // Menor a 9.49 → Anemia
         
         const result = calculateDiagnostic(
            birthDate,
            'M',
            false,
            false,
            '0',
            hb,
            '0'
         );

         expect(result).toBe('Anemia');
      });
   });

   describe('Pacientes femeninos en límites exactos', () => {
      test('Mujer de exactamente 15 años no gestante', () => {
         const birthDate = dayjs(currentDate).subtract(15, 'years').format('YYYY-MM-DD');
         const hb = '11.5'; // Entre 10.90 y 11.90 → Anemia Leve
         
         const result = calculateDiagnostic(
            birthDate,
            'F',
            false,
            false,
            '0',
            hb,
            '0'
         );

         expect(result).toBe('Anemia Leve');
      });

      test('Mujer gestante primer trimestre', () => {
         const birthDate = dayjs(currentDate).subtract(25, 'years').format('YYYY-MM-DD');
         const hb = '10.5'; // Entre 9.90 y 10.90 → Anemia Leve
         
         const result = calculateDiagnostic(
            birthDate,
            'F',
            true,
            false,
            '1',
            hb,
            '0'
         );

         expect(result).toBe('Anemia Leve');
      });
   });
});
