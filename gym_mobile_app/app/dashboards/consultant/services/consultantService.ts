import { apiService } from './api';
import { Consultant, DashboardStats } from './types';
const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

export class ConsultantService {
  async createProfile(profileData: Partial<Consultant>): Promise<Consultant | null> {
    const response = await apiService.post<Consultant>('/consultants', profileData);
    return response.success ? response.data : null;
  }

  async getProfile(userId: string): Promise<Consultant | null> {
    const response = await apiService.get<Consultant>(`/consultants/user/${userId}`);
    return response.success ? response.data : null;
  }

  async updateProfile(consultantId: string, profileData: Partial<Consultant>): Promise<Consultant | null> {
    const response = await apiService.put<Consultant>(`/consultants/${consultantId}`, profileData);
    return response.success ? response.data : null;
  }

  async getDashboardStats(consultantId: string): Promise<DashboardStats | null> {
    const response = await apiService.get<DashboardStats>(`/consultants/${consultantId}/stats`);
    return response.success ? response.data : null;
  }

  async uploadImage(consultantId: string, imageUri: string): Promise<string | null> {
    // Handle image upload logic here
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    try {
      const response = await fetch(`${API_BASE_URL}/consultants/${consultantId}/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      
      const result = await response.json();
      return result.success ? result.imageUrl : null;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  }
}

export const consultantService = new ConsultantService();