import { Supplement } from './types/patient.types';
import { AnemiaSeverity, Gender } from './types/patient.types';

export interface SupplementCalculationInput {
   supplement: Supplement;
   patientAgeDays: number;
   patientWeight: number;
   isAnemic: boolean;
   patientGender: Gender;
   anemiaSeverity: AnemiaSeverity;
   treatmentMonths: number;
   doseAmount: number; // mg/kg/día from dosing guidelines
   isFemalePregnantOrLactating?: boolean;
}

export interface SupplementCalculationResult {
   prescribedDose: number; // Dosis por toma (ml, gotas o tabletas)
   numberOfBottles: number; // Frascos o blisters necesarios
   unitMeasure: string; // 'gotas', 'ml', 'tabletas'
   treatmentDurationDays: number;
}

/**
 * Servicio para cálculos de suplementos
 */
export class SupplementCalculatorService {
   /**
    * Calcula la dosis, número de frascos y otros parámetros para una prescripción
    */
   static calculatePrescription(input: SupplementCalculationInput): SupplementCalculationResult {
      const { supplement, treatmentMonths, isAnemic, doseAmount, patientWeight } = input;
      const treatmentDurationDays = treatmentMonths * 30;

      // Determinar unidad de medida según presentación
      const unitMeasure = this.getUnitMeasure(supplement.presentation);

      // Calcular dosis según tipo de presentación
      let prescribedDose: number;
      let numberOfBottles: number;

      if (supplement.presentation === 'TABLET') {
         // Para tabletas (adultos)
         const result = this.calculateTabletDose(input);
         prescribedDose = result.dosesPerDay;
         numberOfBottles = result.numberOfBlisters;
      } else {
         // Para líquidos (niños)
         const result = this.calculateLiquidDose(input);
         prescribedDose = result.dosePerDay;
         numberOfBottles = result.numberOfBottles;
      }

      return {
         prescribedDose,
         numberOfBottles,
         unitMeasure,
         treatmentDurationDays,
      };
   }

   /**
    * Calcula dosis para suplementos líquidos (gotas, jarabe)
    */
   private static calculateLiquidDose(input: SupplementCalculationInput) {
      const { supplement, patientWeight, isAnemic, doseAmount, treatmentMonths } = input;
      const treatmentDurationDays = treatmentMonths * 30;

      // Calcular dosis diaria en ml
      let dailyDoseML: number;

      if (isAnemic) {
         // Dosis completa para anémicos: peso * doseAmount / hierro elemental
         dailyDoseML = (patientWeight * 3) / supplement.elementalIron;
      } else {
         // 2/3 de la dosis para prevención
         dailyDoseML = (patientWeight * (2 / 3) * doseAmount) / supplement.elementalIron;
      }

      // Convertir a gotas si es presentación de gotas (1ml = 20 gotas)
      // La dosis mostrada es por toma, no por día
      let dosePerIntake: number;
      let numberOfBottles: number;

      if (supplement.presentation === 'DROPS') {
         // Para gotas: convertir ml a gotas, la dosis es única toma diaria
         dosePerIntake = Math.round(dailyDoseML * 20); // Convertir ml a gotas y redondear

         // Calcular número de frascos: content está en ML, pero calculamos en gotas
         const totalDrops = dosePerIntake * treatmentDurationDays;
         const dropsPerBottle = supplement.content * 20; // Convertir contenido de ml a gotas
         numberOfBottles = Math.ceil(totalDrops / dropsPerBottle);
      } else {
         // Para jarabe (SYRUP): la dosis en ml es por toma única diaria
         dosePerIntake = Math.round(dailyDoseML); // Redondear a entero (ej: 9.7 → 10 ml)

         // Calcular número de frascos basado en ml diarios totales
         const totalML = dailyDoseML * treatmentDurationDays;
         numberOfBottles = Math.ceil(totalML / supplement.content);
      }

      return {
         dosePerDay: dosePerIntake,
         numberOfBottles,
      };
   }

   /**
    * Calcula dosis para tabletas (adultos)
    */
   private static calculateTabletDose(input: SupplementCalculationInput) {
      const { isAnemic, anemiaSeverity, treatmentMonths } = input;
      const treatmentDurationDays = treatmentMonths * 30;
      const tabletsPerBlister = 100; // Definido como estándar

      // Determinar dosis por día
      // Anémicos toman 2 tabletas/día, sanos toman 1 tableta/día
      const dosesPerDay = (isAnemic || anemiaSeverity !== AnemiaSeverity.NONE) ? 2 : 1;

      // Calcular tabletas totales necesarias
      const totalTablets = dosesPerDay * treatmentDurationDays;

      // Calcular número de blisters (redondeado hacia arriba)
      const numberOfBlisters = Math.ceil(totalTablets / tabletsPerBlister);

      return {
         dosesPerDay,
         numberOfBlisters,
      };
   }

   /**
    * Obtiene la unidad de medida según la presentación
    */
   private static getUnitMeasure(presentation: string): string {
      switch (presentation) {
         case 'DROPS':
            return 'gotas';
         case 'SYRUP':
            return 'ml';
         case 'TABLET':
            return 'tabletas';
         case 'POWDER':
            return 'gramos';
         default:
            return 'unidades';
      }
   }

   /**
    * Determina el ID del suplemento apropiado para adultos según género y diagnóstico
    */
   static getAdultSupplementId(
      gender: Gender,
      anemiaSeverity: AnemiaSeverity,
      isFemalePregnantOrLactating: boolean,
   ): string {
      const hasAnemia = anemiaSeverity !== AnemiaSeverity.NONE;

      if (gender === Gender.MALE) {
         // Hombre sano: 60mg, enfermo: 120mg
         return hasAnemia
            ? 'SUPP-ADULT-SULFATO-120MG'
            : 'SUPP-ADULT-SULFATO-60MG';
      } else {
         // Mujer
         if (hasAnemia || isFemalePregnantOrLactating) {
            // Anémica, gestante o puérpera: 120mg + 800µg ácido fólico
            return 'SUPP-ADULT-SULFATO-120MG-FOLICO-800UG';
         } else {
            // Mujer sana: 60mg
            return 'SUPP-ADULT-SULFATO-60MG';
         }
      }
   }
}
