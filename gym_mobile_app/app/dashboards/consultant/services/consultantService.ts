import { apiService } from './api';
import { Consultant } from './types';

class ConsultantService {
  // Get consultant profile by user ID
  async getProfile(userId: string): Promise<Consultant> {
    try {
      return await apiService.get<Consultant>(`/consultants/user/${userId}`);
    } catch (error) {
      console.error('Error fetching consultant profile:', error);
      throw error;
    }
  }

  // Create consultant profile
  async createProfile(profileData: Partial<Consultant>): Promise<Consultant> {
    try {
      // Add required fields if not present
      const payload = {
        ...profileData,
        consent: profileData.consent ?? true,
        privacyNoticeAccepted: profileData.privacyNoticeAccepted ?? true,
      };
      
      return await apiService.post<Consultant>('/consultants', payload);
    } catch (error) {
      console.error('Error creating consultant profile:', error);
      throw error;
    }
  }

  // Update consultant profile
  async updateProfile(consultantId: string, profileData: Partial<Consultant>): Promise<Consultant> {
    try {
      // Backend uses PUT /consultants (finds by user ID from token)
      return await apiService.put<Consultant>('/consultants', profileData);
    } catch (error) {
      console.error('Error updating consultant profile:', error);
      throw error;
    }
  }

  // Get all consultants
  async getAllConsultants(): Promise<Consultant[]> {
    try {
      return await apiService.get<Consultant[]>('/consultants');
    } catch (error) {
      console.error('Error fetching all consultants:', error);
      throw error;
    }
  }

  // Get consultant by ID
  async getConsultantById(id: string): Promise<Consultant> {
    try {
      return await apiService.get<Consultant>(`/consultants/${id}`);
    } catch (error) {
      console.error('Error fetching consultant by ID:', error);
      throw error;
    }
  }
}

export const consultantService = new ConsultantService();