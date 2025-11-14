import { useMemo } from 'react';
import { Suplement } from '@/modules/suplement/dto/suplement.dto';
import {
   getDose,
   getBottleNumber,
   getUnitMeasure,
   getAdultTreatment,
   getById,
} from '@/modules/suplement/services/suplement.service';
import { Patient } from '@/modules/patient/dto/patient.dto';
import { Gender } from '@/services/types/patient.types';
import dayjs from 'dayjs';

interface SupplementCalculationInput {
   birthDate: string;
   weight: number;
   isAnemic: boolean;
   gender: Gender;
   supplementId?: string;
}

interface SupplementResult {
   supplement: Suplement | null;
   doseAmount: number;
   bottleNumber: number;
   unitMeasure: string;
   isAdult: boolean;
   treatmentDescription: string;
}

export const useSupplementCalculations = () => {
   /**
    * Calcula la dosis y tratamiento de suplementación
    */
   const calculateSupplement = (input: SupplementCalculationInput): SupplementResult => {
      const ageInDays = dayjs().diff(dayjs(input.birthDate), 'day');
      const ageInYears = dayjs().diff(dayjs(input.birthDate), 'year');
      const isAdult = ageInYears >= 18;

      // Para adultos, usar tratamiento específico
      if (isAdult) {
         // Mapear a formato Patient existente para usar getAdultTreatment
         const patientData: Partial<Patient> = {
            gender: input.gender === Gender.MALE ? 'M' : 'F',
            // Nota: getAdultTreatment usa getPatientDiagnostic internamente
            // pero aquí lo simplificamos usando isAnemic directamente
         };

         // Determinar suplemento para adulto
         let adultSupplement: Suplement | null = null;
         let treatmentDescription = '';

         if (input.gender === Gender.MALE) {
            if (input.isAnemic) {
               adultSupplement = getById('9'); // Sulfato Ferroso 120mg
               treatmentDescription = 'Tabletas de Sulfato Ferroso 120mg - 1 tableta diaria por 6 meses';
            } else {
               adultSupplement = getById('8'); // Sulfato Ferroso 60mg
               treatmentDescription = 'Tabletas de Sulfato Ferroso 60mg - 1 tableta diaria por 3 meses (prevención)';
            }
         } else {
            // Mujer
            if (input.isAnemic) {
               adultSupplement = getById('10'); // Sulfato Ferroso 120mg + Ácido Fólico
               treatmentDescription = 'Tabletas de Sulfato Ferroso 120mg + Ácido Fólico 800µg - 1 tableta diaria por 6 meses';
            } else {
               adultSupplement = getById('8'); // Sulfato Ferroso 60mg
               treatmentDescription = 'Tabletas de Sulfato Ferroso 60mg - 1 tableta diaria por 3 meses (prevención)';
            }
         }

         return {
            supplement: adultSupplement,
            doseAmount: 1, // 1 tableta por día
            bottleNumber: input.isAnemic ? 180 : 90, // 6 meses o 3 meses
            unitMeasure: 'tabletas',
            isAdult: true,
            treatmentDescription,
         };
      }

      // Para niños y adolescentes
      const supplement = input.supplementId ? getById(input.supplementId) : null;

      if (!supplement) {
         return {
            supplement: null,
            doseAmount: 0,
            bottleNumber: 0,
            unitMeasure: '',
            isAdult: false,
            treatmentDescription: 'Seleccione un suplemento para calcular la dosis',
         };
      }

      const doseAmount = getDose(supplement, ageInDays, input.weight, input.isAnemic);
      const bottleNumber = getBottleNumber(doseAmount, supplement);
      const unitMeasure = getUnitMeasure(supplement) || '';

      const treatmentDescription = input.isAnemic
         ? `${supplement.name} - ${doseAmount.toFixed(2)} ${unitMeasure} diarios por 6 meses (${bottleNumber} frascos)`
         : `${supplement.name} - ${doseAmount.toFixed(2)} ${unitMeasure} diarios por 3 meses (${Math.ceil(bottleNumber / 2)} frascos)`;

      return {
         supplement,
         doseAmount,
         bottleNumber: input.isAnemic ? bottleNumber : Math.ceil(bottleNumber / 2),
         unitMeasure,
         isAdult: false,
         treatmentDescription,
      };
   };

   /**
    * Obtiene suplementos recomendados según edad
    */
   const getRecommendedSupplements = (ageInYears: number): string[] => {
      if (ageInYears >= 18) {
         return ['8', '9', '10']; // Tabletas para adultos
      } else if (ageInYears >= 5) {
         return ['1', '4', '6']; // Jarabes para niños mayores
      } else {
         return ['2', '3', '5']; // Gotas para bebés y niños pequeños
      }
   };

   return {
      calculateSupplement,
      getRecommendedSupplements,
   };
};
