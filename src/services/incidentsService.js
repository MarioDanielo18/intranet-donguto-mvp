/**
 * Service for managing incidents (currently stored in LocalStorage,
 * ready to be easily migrated to Supabase endpoints).
 */
const INCIDENTS_KEY = 'donguto-incidents';

export const incidentsService = {
  /**
   * Fetch all incidents
   */
  async fetchIncidents() {
    try {
      const saved = localStorage.getItem(INCIDENTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('[Incidents Service] Error loading from local storage:', e);
      return [];
    }
  },

  /**
   * Save a list of incidents
   */
  async saveIncidents(incidents) {
    try {
      localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
      return { success: true };
    } catch (e) {
      console.error('[Incidents Service] Error saving to local storage:', e);
      throw e;
    }
  }
};

export default incidentsService;
