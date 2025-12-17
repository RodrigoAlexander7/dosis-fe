// Enums
export enum Gender {
   MALE = 'MALE',
   FEMALE = 'FEMALE',
}

export enum FemaleAdditional {
   NONE = 'NONE',
   PREGNANT = 'PREGNANT',
   LACTATING = 'LACTATING',
}

export enum GestationTrimester {
   NONE = 'NONE',
   FIRST = 'FIRST',
   SECOND = 'SECOND',
   THIRD = 'THIRD',
}

export enum AnemiaSeverity {
   NONE = 'NONE',
   MILD = 'MILD',
   MODERATE = 'MODERATE',
   SEVERE = 'SEVERE',
}

// Patient Types
export interface Patient {
   id: string;
   dni: string;
   name: string;
   birthDate: string;
   gender: Gender;
   isActive: boolean;
   departmentId: string;
   provinceId: string;
   districtId: string;
   townId: string;
   createdAt: string;
   updatedAt: string;
   createdById: string;
   updatedById: string | null;
   department?: {
      id: string;
      name: string;
   };
   province?: {
      id: string;
      name: string;
   };
   district?: {
      id: string;
      name: string;
   };
   town?: {
      id: string;
      name: string;
      altitudeAdjustment: string;
   };
   visits?: PatientVisit[];
   createdBy?: {
      id: string;
      name: string;
      email: string;
      role: string;
   };
}

export interface Supplement {
   idSupplement: string;
   name: string;
   type: string;
   presentation: 'TABLET' | 'SYRUP' | 'DROPS' | 'POWDER';
   elementalIron: number;
   content: number;
   notes: string;
}

export interface Prescription {
   prescriptionId: number;
   visitId: number;
   idSupplement: string;
   prescribedDose: number;
   treatmentDurationDays: number;
   treatmentMonths: number;
   numberOfBottles: number;
   unitMeasure: string;
   prescriptionNotes: string | null;
   createdAt: string;
   supplement?: Supplement;
}

export interface PatientVisit {
   visitId: number;
   patientDni: string;
   visitDate: string;
   weight: number;
   hbObserved: number;
   hbAdjusted: number;
   anemiaSeverity: AnemiaSeverity;
   femaleAdditional: FemaleAdditional;
   gestationTrimester: GestationTrimester;
   createdAt: string;
   createdById: string;
   createdBy?: {
      id: string;
      name: string;
      role: string;
   };
   prescriptions?: Prescription[];
}

// DTOs
export interface CreatePatientDto {
   dni: string;
   birthDate: string;
   gender: Gender;
   departmentId: number;
   provinceId: number;
   districtId: number;
   townId: number;
   firstVisit: CreateFirstVisitDto;
}

export interface CreateFirstVisitDto {
   visitDate: string;
   weight: number;
   hbObserved: number;
   hbAdjusted: number;
   anemiaSeverity: AnemiaSeverity;
   femaleAdditional: FemaleAdditional;
   gestationTrimester: GestationTrimester;
}

export interface UpdatePatientDto {
   birthDate?: string;
   gender?: Gender;
   departmentId?: number;
   provinceId?: number;
   districtId?: number;
   townId?: number;
   isActive?: boolean;
}

export interface SearchPatientDto {
   dni?: string;
   birthYear?: number;
   anemiaSeverity?: AnemiaSeverity;
   page?: number;
   limit?: number;
}

export interface PaginatedPatientResponse {
   data: Patient[];
   total: number;
   page: number;
   limit: number;
   totalPages: number;
}

export interface PatientStatistics {
   totalPatients: number;
   activePatients: number;
   inactivePatients: number;
   totalVisits: number;
   byGender: {
      MALE: number;
      FEMALE: number;
   };
   byAnemiaSeverity: {
      NONE: number;
      MILD: number;
      MODERATE: number;
      SEVERE: number;
   };
}
