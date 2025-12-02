import React, { useMemo } from "react";
import dayjs from "dayjs";
import { Gender, AnemiaSeverity } from "@/services/types/patient.types";
import { Supplement } from "@/services/types/supplement.types";
import { SupplementCalculatorService } from "@/services/supplement-calculator.service";
import { useHemoglobinCalculations } from "@/hooks/useHemoglobinCalculations";

interface UseSupplementCalculationProps {
  selectedSupplement: Supplement | undefined;
  patient: any;
  weight: string;
  patientAgeDays: number | null;
  hbObserved: string;
  femaleAditional: "G" | "P" | "";
  gestationTime: "1" | "2" | "3" | "";
  treatmentMonths: number;
}

export const useSupplementCalculation = ({
  selectedSupplement,
  patient,
  weight,
  patientAgeDays,
  hbObserved,
  femaleAditional,
  gestationTime,
  treatmentMonths,
}: UseSupplementCalculationProps) => {
  const { calculate, mapExistingToBackend } = useHemoglobinCalculations();

  return useMemo(() => {
    if (
      !selectedSupplement ||
      !patient ||
      !weight ||
      !patientAgeDays ||
      !hbObserved
    )
      return null;

    const dosingGuideline = selectedSupplement.dosingGuidelines.find(
      (guideline) =>
        patientAgeDays >= guideline.fromAgeDays &&
        patientAgeDays <= guideline.toAgeDays
    );

    if (!dosingGuideline) return null;

    const altitudeAdjustment = patient.town?.altitudeAdjustment
      ? Number(patient.town.altitudeAdjustment)
      : 0;

    const patientGender =
      patient.gender === Gender.MALE ? "M" : ("F" as "M" | "F");
    const mappedFemaleAdditional =
      femaleAditional === "" ? null : femaleAditional;
    const mappedGestationTime = gestationTime === "" ? null : gestationTime;

    const backendTypes = mapExistingToBackend({
      gender: patientGender,
      femaleAditional: mappedFemaleAdditional,
      gestationTime: mappedGestationTime,
    });

    const calculations = calculate({
      hbObserved: Number(hbObserved),
      altitudeAdjustment,
      birthDate: patient.birthDate,
      gender: backendTypes.gender,
      femaleAdditional: backendTypes.femaleAdditional,
      gestationTrimester: backendTypes.gestationTrimester,
    });

    const isAnemic = calculations.anemiaSeverity !== AnemiaSeverity.NONE;
    const isFemalePregnantOrLactating =
      femaleAditional === "G" || femaleAditional === "P";

    const prescriptionData = SupplementCalculatorService.calculatePrescription({
      supplement: selectedSupplement,
      patientAgeDays,
      patientWeight: Number(weight),
      isAnemic,
      patientGender: patient.gender,
      anemiaSeverity: calculations.anemiaSeverity,
      treatmentMonths,
      doseAmount: dosingGuideline.doseAmount,
      isFemalePregnantOrLactating,
    });

    return {
      supplement: selectedSupplement,
      guideline: dosingGuideline,
      ...prescriptionData,
    };
  }, [
    selectedSupplement,
    patient,
    weight,
    patientAgeDays,
    hbObserved,
    femaleAditional,
    gestationTime,
    treatmentMonths,
  ]);
};
