import { useState, useEffect, useCallback } from 'react';
import { consultantService } from '../services/consultantService';
import { Consultant } from '../services/types';

export const useConsultant = (userId?: string) => {
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultantProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
        
    try {
      setLoading(true);
      setError(null);
      const profile = await consultantService.getProfile(userId);
      setConsultant(profile);
    } catch (err: any) {
      // If 404, profile doesn't exist - this is not an error state
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        setConsultant(null);
        setError(null); // Not an error, just no profile yet
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      }
      console.error('Fetch consultant error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = async (profileData: Partial<Consultant>) => {
    if (!consultant) {
      throw new Error('No consultant profile to update');
    }

    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await consultantService.updateProfile(
        consultant._id, 
        profileData
      );
      if (updatedProfile) {
        setConsultant(updatedProfile);
      }
      return updatedProfile;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Partial<Consultant>) => {
    try {
      setLoading(true);
      setError(null);
      const newProfile = await consultantService.createProfile(profileData);
      if (newProfile) {
        setConsultant(newProfile);
      }
      return newProfile;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultantProfile();
  }, [fetchConsultantProfile]);

  return {
    consultant,
    loading,
    error,
    updateProfile,
    createProfile,
    refetch: fetchConsultantProfile,
  };
};