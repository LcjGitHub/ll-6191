import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';
import type { FishingRecord } from '@/types/record';

interface RecordState {
  records: FishingRecord[];
  addRecord: (record: Omit<FishingRecord, 'id' | 'createdAt'>) => void;
  removeRecord: (id: string) => void;
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
    }),
    {
      name: 'freshwater-fishing-records',
    },
  ),
);

/** 按日期倒序排列记录 */
export function getSortedRecords(records: FishingRecord[]): FishingRecord[] {
  return [...records].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
}
