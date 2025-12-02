import type { Dayjs } from "dayjs";
import { create } from "zustand";
import type { SessionInfo } from "@/apis/sessions";

export interface LocalSessionInfo extends SessionInfo {
  id?: string;
  projectSummary?: string;
  analyticTarget?: string;
  createdAt?: Dayjs;
}
interface SessionStoreState {
  setSelectedSessionId: (id: string | null) => void;
  selectedSessionId: string | null;

  selectedFileIdList: string[];
  setSelectedFileIdList: (idList: string[]) => void;
  addSelectedFileId: (id: string) => void;
  removeSelectedFileId: (id: string) => void;
  clearSelectedFileIdList: () => void;

  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  selectedSessionId: null,
  setSelectedSessionId: (id) => set({ selectedSessionId: id }),

  selectedFileIdList: [],
  setSelectedFileIdList: (idList) => set({ selectedFileIdList: idList }),
  addSelectedFileId: (id) =>
    set((state) => ({ selectedFileIdList: [...state.selectedFileIdList, id] })),
  removeSelectedFileId: (id) =>
    set((state) => ({
      selectedFileIdList: state.selectedFileIdList.filter((_id) => _id !== id),
    })),
  clearSelectedFileIdList: () => set({ selectedFileIdList: [] }),

  selectedJobId: null,
  setSelectedJobId: (id) => set({ selectedJobId: id }),
}));
