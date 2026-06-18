import dayjs from 'dayjs';
import type { FishingRecord } from '@/types/record';

/** 汇总统计数据 */
export interface StatisticsSummary {
  totalCount: number;
  totalWeight: number;
  currentMonthCount: number;
}

/** 鱼种统计项 */
export interface SpeciesStat {
  name: string;
  count: number;
  percentage: number;
}

/** 计算汇总统计数据 */
export function calculateSummary(records: FishingRecord[]): StatisticsSummary {
  const totalCount = records.length;
  const totalWeight = records.reduce((sum, r) => sum + (r.weight || 0), 0);
  const now = dayjs();
  const currentMonthStart = now.startOf('month');
  const currentMonthEnd = now.endOf('month');
  const currentMonthCount = records.filter((r) => {
    const date = dayjs(r.date);
    return date.isAfter(currentMonthStart.subtract(1, 'day')) && date.isBefore(currentMonthEnd.add(1, 'day'));
  }).length;

  return {
    totalCount,
    totalWeight,
    currentMonthCount,
  };
}

/** 计算各鱼种钓获数量占比 */
export function calculateSpeciesStats(records: FishingRecord[]): SpeciesStat[] {
  if (records.length === 0) {
    return [];
  }

  const speciesMap = new Map<string, number>();
  records.forEach((r) => {
    const count = speciesMap.get(r.fishSpeciesName) || 0;
    speciesMap.set(r.fishSpeciesName, count + 1);
  });

  const total = records.length;
  const stats: SpeciesStat[] = Array.from(speciesMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100 * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count);

  return stats;
}
