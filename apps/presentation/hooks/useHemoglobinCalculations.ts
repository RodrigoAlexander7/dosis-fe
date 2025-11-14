import { useState, useEffect } from 'react';
import { calculateDiagnostic } from '@/modules/patient/services/patientDiagnostic.service';
import { AnemiaSeverity, FemaleAdditional, GestationTrimester, Gender } from '@/services/types/patient.types';

interface HemoglobinCalculationParams {
   hbObserved: number;
   altitudeAdjustment: number;
   birthDate: string;
   gender: Gender;
   femaleAdditional?: FemaleAdditional;
   gestationTrimester?: GestationTrimester;
}

export const useHemoglobinCalculations = () => {
   const [hbAdjusted, setHbAdjusted] = useState<number>(0);
   const [anemiaSeverity, setAnemiaSeverity] = useState<AnemiaSeverity>(AnemiaSeverity.NONE);

   /**
    * Calcula hemoglobina ajustada y severidad de anemia
    * Usa la lógica existente en patientDiagnostic.service.ts
    */
   const calculate = (params: HemoglobinCalculationParams) => {
      const { hbObserved, altitudeAdjustment, birthDate, gender, femaleAdditional, gestationTrimester } = params;

      // Calcular HB ajustada
      const adjusted = hbObserved - altitudeAdjustment;
      setHbAdjusted(adjusted);

      // Mapear Gender del backend a formato existente ('M' | 'F')
      const genderCode = gender === Gender.MALE ? 'M' : 'F';

      // Mapear FemaleAdditional
      const isGestant = femaleAdditional === FemaleAdditional.PREGNANT;
      const isPuerper = femaleAdditional === FemaleAdditional.LACTATING;

      // Mapear GestationTrimester
      let gestationTimeCode = '0';
      if (gestationTrimester === GestationTrimester.FIRST) gestationTimeCode = '1';
      if (gestationTrimester === GestationTrimester.SECOND) gestationTimeCode = '2';
      if (gestationTrimester === GestationTrimester.THIRD) gestationTimeCode = '3';

      // Usar función existente de cálculo de diagnóstico
      const diagnostic = calculateDiagnostic(
         birthDate,
         genderCode,
         isGestant,
         isPuerper,
         gestationTimeCode,
         String(hbObserved),
         String(altitudeAdjustment)
      );

      // Mapear diagnóstico a AnemiaSeverity del backend
      const severity = mapDiagnosticToSeverity(diagnostic || 'Paciente Sano');
      setAnemiaSeverity(severity);

      return {
         hbAdjusted: adjusted,
         anemiaSeverity: severity,
         diagnostic,
      };
   };

   /**
    * Mapea el diagnóstico de texto a enum AnemiaSeverity
    */
   const mapDiagnosticToSeverity = (diagnostic: string): AnemiaSeverity => {
      if (diagnostic.includes('Severa')) return AnemiaSeverity.SEVERE;
      if (diagnostic.includes('Moderada')) return AnemiaSeverity.MODERATE;
      if (diagnostic.includes('Leve')) return AnemiaSeverity.MILD;
      return AnemiaSeverity.NONE;
   };

   /**
    * Mapea enums del backend a formato existente para compatibilidad
    */
   const mapBackendToExisting = (params: {
      gender: Gender;
      femaleAdditional: FemaleAdditional;
      gestationTrimester: GestationTrimester;
   }) => {
      return {
         gender: params.gender === Gender.MALE ? 'M' : 'F' as 'M' | 'F',
         femaleAditional: params.femaleAdditional === FemaleAdditional.PREGNANT ? 'G' :
            params.femaleAdditional === FemaleAdditional.LACTATING ? 'P' : null,
         gestationTime: params.gestationTrimester === GestationTrimester.FIRST ? '1' :
            params.gestationTrimester === GestationTrimester.SECOND ? '2' :
               params.gestationTrimester === GestationTrimester.THIRD ? '3' : null,
      };
   };

   /**
    * Mapea formato existente a enums del backend
    */
   const mapExistingToBackend = (params: {
      gender: 'M' | 'F';
      femaleAditional: 'G' | 'P' | null;
      gestationTime: '1' | '2' | '3' | null;
   }) => {
      return {
         gender: params.gender === 'M' ? Gender.MALE : Gender.FEMALE,
         femaleAdditional: params.femaleAditional === 'G' ? FemaleAdditional.PREGNANT :
            params.femaleAditional === 'P' ? FemaleAdditional.LACTATING : FemaleAdditional.NONE,
         gestationTrimester: params.gestationTime === '1' ? GestationTrimester.FIRST :
            params.gestationTime === '2' ? GestationTrimester.SECOND :
               params.gestationTime === '3' ? GestationTrimester.THIRD : GestationTrimester.NONE,
      };
   };

   return {
      hbAdjusted,
      anemiaSeverity,
      calculate,
      mapDiagnosticToSeverity,
      mapBackendToExisting,
      mapExistingToBackend,
   };
};
