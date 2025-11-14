import { apiClient } from './apiClient';

export interface SupplementDose {
   doseId: number;
   idSupplement: string;
   fromAgeDays: number;
   toAgeDays: number;
   doseAmount: number;
   createdAt: string;
}

export interface Supplement {
   idSupplement: string;
   name: string;
   type: string;
   presentation: 'TABLET' | 'SYRUP' | 'DROPS' | 'POWDER';
   elementalIron: number;
   content: number;
   notes: string;
   createdAt: string;
   dosingGuidelines: SupplementDose[];
}

export const supplementsApi = {
   /**
    * Get all available supplements
    */
   getAll: async (): Promise<Supplement[]> => {
      const response = await apiClient.get<Supplement[]>('/supplements');
      return response.data;
   },

   /**
    * Get supplement by ID
    */
   getById: async (id: string): Promise<Supplement> => {
      const response = await apiClient.get<Supplement>(`/supplements/${id}`);
      return response.data;
   },

   /**
    * Get recommended supplements for patient age
    */
   getRecommended: async (ageDays: number): Promise<Supplement[]> => {
      const response = await apiClient.get<Supplement[]>('/supplements/recommended', {
         params: { ageDays },
      });
      return response.data;
   },
};
