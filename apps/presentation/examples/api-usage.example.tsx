// Ejemplo de cómo usar React Query con el API Client

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';

// ========================================
// EJEMPLO 1: Obtener lista de pacientes
// ========================================

interface Patient {
   dni: string;
   birthDate: string;
   gender: 'MALE' | 'FEMALE' | 'OTHER';
   weight?: number;
   createdAt: string;
}

export function usePatientsQuery() {
   return useQuery({
      queryKey: ['patients'],
      queryFn: async () => {
         const response = await apiClient.get<Patient[]>('/patients');
         return response.data;
      },
   });
}

// Uso en componente:
// const { data: patients, isLoading, error } = usePatientsQuery();

// ========================================
// EJEMPLO 2: Crear paciente
// ========================================

interface CreatePatientDto {
   dni: string;
   birthDate: string;
   gender: 'MALE' | 'FEMALE' | 'OTHER';
   weight?: number;
   departmentId: number;
   provinceId: number;
   districtId: number;
   townId: number;
}

export function useCreatePatientMutation() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: CreatePatientDto) => {
         const response = await apiClient.post<Patient>('/patients', data);
         return response.data;
      },
      onSuccess: () => {
         // Invalidar y refrescar la lista de pacientes
         queryClient.invalidateQueries({ queryKey: ['patients'] });
      },
   });
}

// Uso en componente:
// const createPatient = useCreatePatientMutation();
// await createPatient.mutateAsync(patientData);

// ========================================
// EJEMPLO 3: Obtener perfil de usuario
// ========================================

export function useCurrentUserQuery() {
   return useQuery({
      queryKey: ['user', 'me'],
      queryFn: async () => {
         const response = await apiClient.get('/users/me');
         return response.data;
      },
      staleTime: Infinity, // El perfil no cambia frecuentemente
   });
}

// ========================================
// EJEMPLO 4: Búsqueda con parámetros
// ========================================

export function useSearchPatientsQuery(searchTerm: string) {
   return useQuery({
      queryKey: ['patients', 'search', searchTerm],
      queryFn: async () => {
         const response = await apiClient.get('/patients', {
            params: { search: searchTerm },
         });
         return response.data;
      },
      enabled: searchTerm.length >= 3, // Solo buscar si hay al menos 3 caracteres
   });
}

// ========================================
// EJEMPLO 5: Manejo de errores
// ========================================

import { Alert } from 'react-native';

export function usePatientDetailsQuery(dni: string) {
   return useQuery({
      queryKey: ['patients', dni],
      queryFn: async () => {
         const response = await apiClient.get(`/patients/${dni}`);
         return response.data;
      },
      onError: (error: any) => {
         const message = error.response?.data?.message || 'Error al cargar paciente';
         Alert.alert('Error', message);
      },
   });
}

// ========================================
// EJEMPLO 6: Actualizar paciente
// ========================================

interface UpdatePatientDto {
   weight?: number;
   departmentId?: number;
   provinceId?: number;
   districtId?: number;
   townId?: number;
}

export function useUpdatePatientMutation() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({ dni, data }: { dni: string; data: UpdatePatientDto }) => {
         const response = await apiClient.patch(`/patients/${dni}`, data);
         return response.data;
      },
      onSuccess: (data, variables) => {
         // Actualizar caché de ese paciente específico
         queryClient.invalidateQueries({ queryKey: ['patients', variables.dni] });
         // Actualizar lista general
         queryClient.invalidateQueries({ queryKey: ['patients'] });
      },
   });
}

// ========================================
// EJEMPLO 7: Componente completo
// ========================================

/*
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { usePatientsQuery, useCreatePatientMutation } from '@/hooks/usePatients';

export default function PatientsScreen() {
  const { data: patients, isLoading, error } = usePatientsQuery();
  const createPatient = useCreatePatientMutation();

  const handleCreatePatient = async () => {
    try {
      await createPatient.mutateAsync({
        dni: '12345678',
        birthDate: '1990-01-01',
        gender: 'MALE',
        weight: 70,
        departmentId: 1,
        provinceId: 1,
        districtId: 1,
        townId: 1,
      });
      Alert.alert('Éxito', 'Paciente creado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el paciente');
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error al cargar pacientes</Text>;
  }

  return (
    <View>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.dni}
        renderItem={({ item }) => (
          <View>
            <Text>{item.dni}</Text>
          </View>
        )}
      />
      <TouchableOpacity onPress={handleCreatePatient}>
        <Text>Crear Paciente</Text>
      </TouchableOpacity>
    </View>
  );
}
*/
