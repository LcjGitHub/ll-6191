import type { FishingMethodOption } from '@/types/record';

export const FISHING_METHOD_OPTIONS = [
  '台钓',
  '路亚',
  '传统钓',
  '筏钓',
] as const satisfies readonly FishingMethodOption[];

export const FISHING_METHOD_COLORS: Record<FishingMethodOption, string> = {
  台钓: 'teal',
  路亚: 'blue',
  传统钓: 'orange',
  筏钓: 'violet',
};
