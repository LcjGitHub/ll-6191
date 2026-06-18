import type { FishingRecord, WeatherOption } from '@/types/record';

interface FilterOptions {
  fishSpeciesId?: string | null;
  weather?: WeatherOption | null;
}

export function filterRecords(
  records: FishingRecord[],
  options: FilterOptions,
): FishingRecord[] {
  const { fishSpeciesId, weather } = options;

  return records.filter((record) => {
    if (fishSpeciesId && record.fishSpeciesId !== fishSpeciesId) {
      return false;
    }
    if (weather && record.weather !== weather) {
      return false;
    }
    return true;
  });
}

export function hasActiveFilter(options: FilterOptions): boolean {
  return Boolean(options.fishSpeciesId || options.weather);
}
