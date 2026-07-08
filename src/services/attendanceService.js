import { apiRequest } from './apiService';

/**
 * Service for biometric syncing and user/collaborator management
 */
export const attendanceService = {
  /**
   * Fetch all users from Supabase
   */
  async fetchUsers() {
    return apiRequest('/api/manage-users');
  },

  /**
   * Sync biometric punch logs from ZKTeco device
   */
  async syncZKPunches() {
    return apiRequest('/api/sync-zk', {
      headers: { 'Cache-Control': 'no-cache' }
    });
  },

  /**
   * Save a newly registered collaborator in Supabase
   */
  async createUser(userObj) {
    return apiRequest('/api/manage-users', {
      method: 'POST',
      body: {
        action: 'create',
        username: userObj.username,
        password: userObj.password,
        name: userObj.name,
        role: userObj.role,
        store: userObj.store,
        biometricId: userObj.biometricId || null
      }
    });
  },

  /**
   * Remove a collaborator from Supabase
   */
  async deleteUser(username) {
    return apiRequest('/api/manage-users', {
      method: 'POST',
      body: {
        action: 'delete',
        username
      }
    });
  },

  /**
   * Update a collaborator profile/password/biometricId in Supabase
   */
  async updateUser(username, updatedFields) {
    return apiRequest('/api/manage-users', {
      method: 'POST',
      body: {
        action: 'update',
        username,
        password: updatedFields.password,
        name: updatedFields.name,
        role: updatedFields.role,
        store: updatedFields.store,
        biometricId: updatedFields.biometricId || null
      }
    });
  }
};

export default attendanceService;
