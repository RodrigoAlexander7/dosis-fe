import apiClient from '../apiClient';
import {
   CreatePatientVisitDto,
   UpdatePatientVisitDto,
   SearchVisitDto,
   PaginatedVisitResponse,
   VisitStatistics,
} from '../types/visit.types';
import { PatientVisit } from '../types/patient.types';

export const visitsApi = {
   // Crear nueva visita para paciente existente (Doctor/Enfermera)
   create: async (data: CreatePatientVisitDto): Promise<PatientVisit> => {
      const response = await apiClient.post<PatientVisit>('/visits', data);
      return response.data;
   },

   // Buscar visitas con filtros
   search: async (params: SearchVisitDto): Promise<PaginatedVisitResponse> => {
      const response = await apiClient.get<PaginatedVisitResponse>('/visits/search', {
         params,
      });
      return response.data;
   },

   // Obtener todas las visitas de un paciente
   getByPatientDni: async (dni: string): Promise<PatientVisit[]> => {
      const response = await apiClient.get<PatientVisit[]>(`/visits/patient/${dni}`);
      return response.data;
   },

   // Obtener visita por ID
   getById: async (id: number): Promise<PatientVisit> => {
      const response = await apiClient.get<PatientVisit>(`/visits/${id}`);
      return response.data;
   },

   // Actualizar visita (Creador o Doctor)
   update: async (id: number, data: UpdatePatientVisitDto): Promise<PatientVisit> => {
      const response = await apiClient.patch<PatientVisit>(`/visits/${id}`, data);
      return response.data;
   },

   // Eliminar visita (Doctor)
   delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/visits/${id}`);
   },

   // Obtener estadísticas
   getStatistics: async (): Promise<VisitStatistics> => {
      const response = await apiClient.get<VisitStatistics>('/visits/statistics');
      return response.data;
   },
};
