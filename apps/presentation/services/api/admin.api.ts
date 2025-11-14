import apiClient from '../apiClient';
import {
   AdminUser,
   UpdateRoleDto,
   UpdateStatusDto,
   MedicalStaffMember,
} from '../types/admin.types';

export const adminApi = {
   // Obtener todos los usuarios (Admin)
   getAllUsers: async (): Promise<AdminUser[]> => {
      const response = await apiClient.get<AdminUser[]>('/admin/users');
      return response.data;
   },

   // Obtener personal médico activo (Admin)
   getMedicalStaff: async (): Promise<MedicalStaffMember[]> => {
      const response = await apiClient.get<MedicalStaffMember[]>('/admin/users/medical-staff');
      return response.data;
   },

   // Actualizar rol de usuario (Admin)
   updateRole: async (userId: string, data: UpdateRoleDto): Promise<AdminUser> => {
      const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/role`, data);
      return response.data;
   },

   // Actualizar estado activo de usuario (Admin)
   updateStatus: async (userId: string, data: UpdateStatusDto): Promise<AdminUser> => {
      const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/status`, data);
      return response.data;
   },
};
