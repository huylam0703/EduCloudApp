// src/hooks/useStorage.js
import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/api/userApi'

export function useMyStorage() {
  return useQuery({
    queryKey: ['myStorage'],
    queryFn: userApi.getMyStorage,
    staleTime: 60 * 1000,
  })
}