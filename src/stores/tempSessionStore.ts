import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { create } from "zustand";

export interface SessionInfo {
  id?: string;
  projectSummary?: string;
  analyticTarget?: string;
  createdAt?: Dayjs;
}
interface TempSessionStoreState {
  tempSessionInfoList: SessionInfo[];
  addTempSessionInfo: (sessionInfo?: SessionInfo) => void;
}

export const useTempSessionStore = create<TempSessionStoreState>((set) => ({
  tempSessionInfoList: [],
  addTempSessionInfo: (sessionInfo) =>
    set((state) => {
      const randomId = Math.random().toString(36).substring(2, 15);
      const createdAt = dayjs();
      return {
        tempSessionInfoList: [
          ...state.tempSessionInfoList,
          { id: randomId, createdAt, ...sessionInfo },
        ],
      };
    }),

  removeTempSessionInfo: (id: string) =>
    set((state) => ({
      tempSessionInfoList: state.tempSessionInfoList.filter(
        (sessionInfo) => sessionInfo.id !== id
      ),
    })),
  updateTempSessionInfo: (id: string, sessionInfo: SessionInfo) =>
    set((state) => ({
      tempSessionInfoList: state.tempSessionInfoList.map((_sessionInfo) =>
        _sessionInfo.id === id ? sessionInfo : _sessionInfo
      ),
    })),
}));
