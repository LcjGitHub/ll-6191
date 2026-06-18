import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';
import type { FishingRecord } from '@/types/record';

interface RecordState {
  records: FishingRecord[];
  addRecord: (record: Omit<FishingRecord, 'id' | 'createdAt'>) => void;
  removeRecord: (id: string) => void;
  importRecords: (records: FishingRecord[]) => void;
}

const DEFAULT_FISHING_METHOD = '台钓';

function migrateRecords(records: FishingRecord[]): FishingRecord[] {
  return records.map((r) => ({
    ...r,
    fishingMethod: r.fishingMethod ?? DEFAULT_FISHING_METHOD,
    notes: r.notes ?? '',
  }));
}

/** 钓鱼记录 store，持久化至 localStorage */
export const useRecordStore = create<RecordState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) =>
        set((state) => ({
          records: [
            {
              ...record,
              id: crypto.randomUUID(),
              createdAt: dayjs().toISOString(),
            },
            ...state.records,
          ],
        })),
      removeRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),
      importRecords: (records) =>
        set(() => ({
          records,
        })),
    }),
    {
      name: 'freshwater-fishing-records',
      migrate: (persisted) => {
        const state = persisted as RecordState;
        if (Array.isArray(state.records)) {
          state.records = migrateRecords(state.records);
        }
        return state;
      },
      version: 1,
    },
  ),
);

/** 按日期倒序排列记录 */
export function getSortedRecords(records: FishingRecord[]): FishingRecord[] {
  return [...records].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
}
