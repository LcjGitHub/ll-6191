import type { WeatherOption } from '@/types/record';

/** 天气下拉选项 */
export const WEATHER_OPTIONS = [
  '晴',
  '多云',
  '阴',
  '小雨',
  '大雨',
  '雾',
  '风',
] as const satisfies readonly WeatherOption[];

/** 天气对应 Mantine 颜色 */
export const WEATHER_COLORS: Record<WeatherOption, string> = {
  晴: 'yellow',
  多云: 'gray',
  阴: 'dark',
  小雨: 'blue',
  大雨: 'indigo',
  雾: 'teal',
  风: 'cyan',
};
