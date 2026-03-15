export type DraftType = 'inventory' | 'spill';

export interface DraftForm {
  id: string;
  type: DraftType;
  data: any;
  timestamp: number;
}

const DRAFTS_KEY = 'csv_offline_drafts';

export const offlineManager = {
  saveDraft: (type: DraftType, data: any) => {
    const drafts = offlineManager.getDrafts();
    const newDraft: DraftForm = {
      id: Math.random().toString(36).substring(7),
      type,
      data,
      timestamp: Date.now(),
    };
    drafts.push(newDraft);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    return newDraft;
  },

  getDrafts: (): DraftForm[] => {
    const data = localStorage.getItem(DRAFTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  removeDraft: (id: string) => {
    const drafts = offlineManager.getDrafts().filter(d => d.id !== id);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  },

  clearDrafts: () => {
    localStorage.removeItem(DRAFTS_KEY);
  }
};
