import { useQuery } from '@tanstack/react-query';
import { drawsService } from '../services/drawsService';

export const DRAWS_QUERY_KEY = ['draws'];

export function useDraws() {
  return useQuery({
    queryKey: DRAWS_QUERY_KEY,
    queryFn: () => drawsService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useLatestDraw() {
  return useQuery({
    queryKey: [...DRAWS_QUERY_KEY, 'latest'],
    queryFn: () => drawsService.getLatest(),
    staleTime: 1000 * 60 * 5,
  });
}
