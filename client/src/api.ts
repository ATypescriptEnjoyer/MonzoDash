import {
  useQuery as useBaseQuery,
  useMutation as useBaseMutation,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';

export const useQuery = <TResponse, TRequest = {}>(endpoint: string, {
  method = 'GET',
  data,
  refetchInterval
}: {
  method?: 'GET' | 'POST';
  data?: TRequest;
  refetchInterval?: number
} = {}): UseQueryResult<TResponse, Error> =>
  useBaseQuery<TResponse>({
    queryKey: [endpoint],
    queryFn: async () => {
      const response = await axios<TResponse>(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
        method,
        headers: {
          Authorization: localStorage.getItem('auth-code') ?? '',
        },
        data,
      });
      return response.data;
    },
    refetchInterval
  });

export const useMutation = <TResponse, TRequest = {}>(endpoint: string, {
  method = 'PUT',
}: {
  method?: 'PUT' | 'POST';
} = {}): UseMutationResult<TResponse, Error, TRequest> =>
  useBaseMutation<TResponse, Error, TRequest>({
    mutationKey: [endpoint],
    mutationFn: async (data) => {
      const response = await axios<TResponse>(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
        method,
        headers: {
          Authorization: localStorage.getItem('auth-code') ?? '',
        },
        data,
      });
      return response.data;
    },
  });
