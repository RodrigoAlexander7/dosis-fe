import apiClient from '../apiClient';

export interface Department {
   id: number;
   name: string;
}

export interface Province {
   id: number;
   name: string;
   departmentId: number;
}

export interface District {
   id: number;
   name: string;
   provinceId: number;
}

export interface Town {
   id: number;
   name: string;
   districtId: number;
   altitudeAdjustment: number;
}

export const locationsApi = {
   getDepartments: async (): Promise<Department[]> => {
      const response = await apiClient.get<Department[]>('/locations/departments');
      return response.data;
   },

   getProvinces: async (departmentId: number): Promise<Province[]> => {
      const response = await apiClient.get<Province[]>(`/locations/provinces?departmentId=${departmentId}`);
      return response.data;
   },

   getDistricts: async (provinceId: number): Promise<District[]> => {
      const response = await apiClient.get<District[]>(`/locations/districts?provinceId=${provinceId}`);
      return response.data;
   },

   getTowns: async (districtId: number): Promise<Town[]> => {
      const response = await apiClient.get<Town[]>(`/locations/towns?districtId=${districtId}`);
      return response.data;
   },

   resolveLocationIds: async (
      departmentName: string,
      provinceName: string,
      districtName: string,
      townName: string,
      altitudeAdjustment: number
   ): Promise<{ departmentId: number; provinceId: number; districtId: number; townId: number }> => {
      const response = await apiClient.post('/locations/resolve', {
         departmentName,
         provinceName,
         districtName,
         townName,
         altitudeAdjustment
      });
      return response.data;
   },
};
