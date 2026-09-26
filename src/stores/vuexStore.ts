/**
 * Vuex Data Persistence Adapter
 * Provides local storage persistence and compatibility for Vuex/Storage requirements.
 */

const LOCAL_STORAGE_KEY = 'adhivasindo_kanban_v1';

export class LocalStorageManager {
  static getStorage() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('LocalStorage read error:', err);
      return null;
    }
  }

  static setStorage(data: any) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  }

  static clearStorage() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}
