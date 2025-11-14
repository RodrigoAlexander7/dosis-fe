export interface AdminUser {
   id: string;
   email: string;
   name: string;
   role: 'DOCTOR' | 'NURSE' | 'ADMIN' | 'PATIENT';
   isActive: boolean;
   createdAt: string;
   accounts: {
      provider: string;
      providerAccountId: string;
   }[];
}

export interface UpdateRoleDto {
   role: 'DOCTOR' | 'NURSE' | 'PATIENT';
}

export interface UpdateStatusDto {
   isActive: boolean;
}

export interface MedicalStaffMember {
   id: string;
   email: string;
   name: string;
   role: 'DOCTOR' | 'NURSE';
   isActive: boolean;
}
