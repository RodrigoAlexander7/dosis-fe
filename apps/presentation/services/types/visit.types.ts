import { AnemiaSeverity, FemaleAdditional, GestationTrimester } from './patient.types';

// Visit DTOs
export interface CreatePatientVisitDto {
   patientDni: string;
   visitDate: string;
   weight: number;
   hbObserved: number;
   hbAdjusted: number;
   anemiaSeverity: AnemiaSeverity;
   femaleAdditional: FemaleAdditional;
   gestationTrimester: GestationTrimester;
}

export interface UpdatePatientVisitDto {
   visitDate?: string;
   weight?: number;
   hbObserved?: number;
   hbAdjusted?: number;
   anemiaSeverity?: AnemiaSeverity;
   femaleAdditional?: FemaleAdditional;
   gestationTrimester?: GestationTrimester;
}

export interface SearchVisitDto {
   patientDni?: string;
   startDate?: string;
   endDate?: string;
   anemiaSeverity?: AnemiaSeverity;
   page?: number;
   limit?: number;
}

export interface PaginatedVisitResponse {
   data: VisitWithPatient[];
   total: number;
   page: number;
   limit: number;
   totalPages: number;
}

export interface VisitWithPatient {
   id: number;
   visitDate: string;
   weight: number;
   hbObserved: number;
   hbAdjusted: number;
   anemiaSeverity: AnemiaSeverity;
   femaleAdditional: FemaleAdditional;
   gestationTrimester: GestationTrimester;
   patient: {
      dni: string;
      name: string;
      birthDate: string;
   };
   createdBy: {
      name: string;
      role: string;
   };
}

export interface VisitStatistics {
   totalVisits: number;
   bySeverity: {
      NONE: number;
      MILD: number;
      MODERATE: number;
      SEVERE: number;
   };
   averageWeight: number;
   averageHbObserved: number;
   averageHbAdjusted: number;
}
