import { apiRequest } from './apiService';

/**
 * Service for managing rotating weekly shifts
 */
export const schedulesService = {
  /**
   * Fetch all schedules in a date range YYYY-MM-DD
   */
  async fetchSchedules(startDate, endDate, store = 'Todas') {
    let url = `/api/manage-schedules?startDate=${startDate}&endDate=${endDate}`;
    if (store && store !== 'Todas') {
      url += `&store=${encodeURIComponent(store)}`;
    }
    return apiRequest(url);
  },

  /**
   * Save (upsert) multiple schedule entries in batch
   */
  async saveSchedules(schedulesArray) {
    return apiRequest('/api/manage-schedules', {
      method: 'POST',
      body: {
        action: 'upsert',
        schedules: schedulesArray
      }
    });
  },

  /**
   * Delete a single schedule entry
   */
  async deleteSchedule(username, fecha) {
    return apiRequest('/api/manage-schedules', {
      method: 'POST',
      body: {
        action: 'delete',
        username,
        fecha
      }
    });
  }
};

export default schedulesService;
