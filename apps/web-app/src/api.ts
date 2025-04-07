import {
  useQuery as useBaseQuery,
  useMutation as useBaseMutation,
  useInfiniteQuery as useBaseInfinityQuery,
  UseQueryResult,
  UseMutationResult,
  keepPreviousData as keepPreviousDataFunc,
} from '@tanstack/react-query';
import axios from 'axios';

export const useQuery = <TResponse, TRequest = object>(
  endpoint: string,
  {
    method = 'GET',
    data,
    refetchInterval,
    keepPreviousData,
  }: {
    method?: 'GET' | 'POST';
    data?: TRequest;
    refetchInterval?: number;
    keepPreviousData?: boolean;
  } = {},
): UseQueryResult<TResponse, Error> =>
  useBaseQuery<TResponse>({
    queryKey: [endpoint],
    placeholderData: keepPreviousData ? keepPreviousDataFunc : undefined,
    queryFn: async () => {
      const response = await axios<TResponse>(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
        method,
        headers: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          Authorization: localStorage.getItem('auth-code') && JSON.parse(localStorage.getItem('auth-code')!),
        },
        data,
      });
      return response.data;
    },
    refetchInterval,
  });

export const useInfiniteQuery = <TResponse>(
  endpoint: string,
  {
    getNextPageParam,
    getPreviousPageParam,
  }: {
    getNextPageParam: (firstPage: TResponse, pages: TResponse[]) => number | undefined;
    getPreviousPageParam: (lastPage: TResponse, pages: TResponse[]) => number | undefined;
  },
) =>
  useBaseInfinityQuery<TResponse, Error>({
    queryKey: [endpoint],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get<TResponse>(`${import.meta.env.VITE_API_URL}/${endpoint}?page=${pageParam}`, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          Authorization: localStorage.getItem('auth-code') && JSON.parse(localStorage.getItem('auth-code')!),
        },
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam,
    getPreviousPageParam,
  });

export const useMutation = <TResponse, TRequest = object>(
  endpoint: string,
  {
    method = 'PUT',
    dataIsParam = false,
  }: {
    method?: 'PUT' | 'POST' | 'DELETE';
    dataIsParam?: boolean;
  } = {},
): UseMutationResult<TResponse, Error, TRequest> =>
  useBaseMutation<TResponse, Error, TRequest>({
    mutationKey: [endpoint],
    mutationFn: async (data) => {
      const urlData = dataIsParam ? `/${data}` : '';
      const response = await axios<TResponse>(`${import.meta.env.VITE_API_URL}/${endpoint}${urlData}`, {
        method,
        headers: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          Authorization: localStorage.getItem('auth-code') && JSON.parse(localStorage.getItem('auth-code')!),
        },
        data: dataIsParam ? undefined : data,
      });
      return response.data;
    },
  });
