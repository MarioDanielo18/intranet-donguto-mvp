import { apiRequest } from './apiService';

/**
 * Service for managing daily and cleaning checklists
 */
export const checklistsService = {
  /**
   * Fetch checklist completions for a specific date and store
   */
  async fetchChecklists(date, store) {
    if (!date || !store) {
      throw new Error('Missing date or store parameters');
    }
    return apiRequest(`/api/checklists?date=${encodeURIComponent(date)}&store=${encodeURIComponent(store)}`);
  },

  /**
   * Upsert a checklist task completion and optional photo evidence
   */
  async saveChecklistTask({ taskId, date, completado, evidencia, colaborador, store }) {
    if (!taskId || !date || !colaborador || !store) {
      throw new Error('Missing required fields for saving task');
    }
    return apiRequest('/api/checklists', {
      method: 'POST',
      body: {
        taskId,
        date,
        completado,
        evidencia,
        colaborador,
        store
      }
    });
  }
};
export default checklistsService;
