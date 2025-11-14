import apiClient from '../apiClient';
import {
   Patient,
   CreatePatientDto,
   UpdatePatientDto,
   SearchPatientDto,
   PaginatedPatientResponse,
   PatientStatistics,
} from '../types/patient.types';

export const patientsApi = {
   // Crear nuevo paciente con primera visita (Doctor)
   create: async (data: CreatePatientDto): Promise<Patient> => {
      const response = await apiClient.post<Patient>('/patients', data);
      return response.data;
   },

   // Buscar pacientes con filtros
   search: async (params: SearchPatientDto): Promise<PaginatedPatientResponse> => {
      const response = await apiClient.get<PaginatedPatientResponse>('/patients/search', {
         params,
      });
      return response.data;
   },

   // Obtener paciente por DNI
   getByDni: async (dni: string): Promise<Patient> => {
      const response = await apiClient.get<Patient>(`/patients/${dni}`);
      return response.data;
   },

   // Actualizar paciente (Doctor)
   update: async (dni: string, data: UpdatePatientDto): Promise<Patient> => {
      const response = await apiClient.patch<Patient>(`/patients/${dni}`, data);
      return response.data;
   },

   // Eliminar paciente (Doctor)
   delete: async (dni: string): Promise<void> => {
      await apiClient.delete(`/patients/${dni}`);
   },

   // Obtener estadísticas
   getStatistics: async (): Promise<PatientStatistics> => {
      const response = await apiClient.get<PatientStatistics>('/patients/statistics');
      return response.data;
   },
};
