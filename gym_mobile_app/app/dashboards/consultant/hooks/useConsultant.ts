import { useState, useEffect, useCallback } from 'react';
import { consultantService } from '../services/consultantService';
import { Consultant } from '../services/types';

export const useConsultant = (userId?: string) => {
  const [consultant, setConsultant] = useState<Consultant | null>(null);
    const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

        const fetchConsultantProfile = useCallback(async () => {
            if (!userId) return;
                
                    try {
                          setLoading(true);
                                setError(null);
                                      const profile = await consultantService.getProfile(userId);
                                            setConsultant(profile);
                                                } catch (err) {
                                                      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
                                                          } finally {
                                                                setLoading(false);
                                                                    }
                                                                      }, [userId]);

                                                                        const updateProfile = async (profileData: Partial<Consultant>) => {
                                                                            if (!consultant) return null;

                                                                                try {
                                                                                      setLoading(true);
                                                                                            const updatedProfile = await consultantService.updateProfile(consultant._id, profileData);
                                                                                                  if (updatedProfile) {
                                                                                                          setConsultant(updatedProfile);
                                                                                                                }
                                                                                                                      return updatedProfile;
                                                                                                                          } catch (err) {
                                                                                                                                setError(err instanceof Error ? err.message : 'Failed to update profile');
                                                                                                                                      throw err;
                                                                                                                                          } finally {
                                                                                                                                                setLoading(false);
                                                                                                                                                    }
                                                                                                                                                      };

                                                                                                                                                        const createProfile = async (profileData: Partial<Consultant>) => {
                                                                                                                                                            try {
                                                                                                                                                                  setLoading(true);
                                                                                                                                                                        const newProfile = await consultantService.createProfile(profileData);
                                                                                                                                                                              if (newProfile) {
                                                                                                                                                                                      setConsultant(newProfile);
                                                                                                                                                                                            }
                                                                                                                                                                                                  return newProfile;
                                                                                                                                                                                                      } catch (err) {
                                                                                                                                                                                                            setError(err instanceof Error ? err.message : 'Failed to create profile');
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