import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';
import { ProfileUpdate } from '../types';

export const PROFILE_QUERY_KEY = ['profile'];

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...PROFILE_QUERY_KEY, user?.id ?? 'guest'],
    queryFn: () => profileService.getCurrent(),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: ProfileUpdate) => profileService.updateCurrent(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}
