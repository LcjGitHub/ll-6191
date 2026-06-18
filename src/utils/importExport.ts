import type { FishingRecord } from '@/types/record';
import { WEATHER_OPTIONS } from '@/constants/weather';

const EXPORT_PREFIX = 'FRESHWATER_FISHING_RECORDS_EXPORT';
const EXPORT_VERSION = 1;
const VALID_WEATHERS = new Set(WEATHER_OPTIONS);

interface ExportData {
  prefix: typeof EXPORT_PREFIX;
  version: number;
  exportedAt: string;
  records: FishingRecord[];
}

export interface ParseResult {
  validRecords: FishingRecord[];
  totalCount: number;
  invalidCount: number;
}

export function exportRecordsToText(records: FishingRecord[]): string {
  const data: ExportData = {
    prefix: EXPORT_PREFIX,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    records,
  };
  return JSON.stringify(data, null, 2);
}

export function downloadRecordsAsFile(records: FishingRecord[]): void {
  const text = exportRecordsToText(records);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `钓鱼记录备份-${dateStr}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseImportedText(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('文件格式错误，无法解析');
  }

  if (
    typeof data !== 'object' ||
    data === null ||
    (data as ExportData).prefix !== EXPORT_PREFIX
  ) {
    throw new Error('文件不是有效的钓鱼记录导出文件');
  }

  const exportData = data as ExportData;
  if (!Array.isArray(exportData.records)) {
    throw new Error('文件中没有记录数据');
  }

  const totalCount = exportData.records.length;
  const validRecords = exportData.records.filter(isValidRecord);
  const invalidCount = totalCount - validRecords.length;

  return { validRecords, totalCount, invalidCount };
}

function isValidRecord(record: unknown): record is FishingRecord {
  if (typeof record !== 'object' || record === null) return false;
  const r = record as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.fishSpeciesId === 'string' &&
    typeof r.fishSpeciesName === 'string' &&
    typeof r.spot === 'string' &&
    typeof r.weather === 'string' &&
    VALID_WEATHERS.has(r.weather as typeof WEATHER_OPTIONS[number]) &&
    typeof r.weight === 'number' &&
    typeof r.date === 'string' &&
    typeof r.createdAt === 'string'
  );
}

export function mergeRecords(
  existing: FishingRecord[],
  imported: FishingRecord[],
): FishingRecord[] {
  const map = new Map<string, FishingRecord>();
  for (const record of existing) {
    map.set(record.id, record);
  }
  for (const record of imported) {
    if (!map.has(record.id)) {
      map.set(record.id, record);
    }
  }
  return Array.from(map.values());
}

export function calculateMergeStats(
  existing: FishingRecord[],
  imported: FishingRecord[],
): { newCount: number; duplicateCount: number } {
  const existingIds = new Set(existing.map((r) => r.id));
  let newCount = 0;
  let duplicateCount = 0;
  for (const record of imported) {
    if (existingIds.has(record.id)) {
      duplicateCount++;
    } else {
      newCount++;
    }
  }
  return { newCount, duplicateCount };
}
