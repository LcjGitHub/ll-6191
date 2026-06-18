/** 鱼种 Mock 数据项 */
export interface FishSpecies {
  id: string;
  name: string;
  habitat: string;
  description: string;
}

/** 天气选项 */
export type WeatherOption =
  | '晴'
  | '多云'
  | '阴'
  | '小雨'
  | '大雨'
  | '雾'
  | '风';

/** 钓法选项 */
export type FishingMethodOption = '台钓' | '路亚' | '传统钓' | '筏钓';

/** 单条钓鱼记录 */
export interface FishingRecord {
  id: string;
  fishSpeciesId: string;
  fishSpeciesName: string;
  spot: string;
  weather: WeatherOption;
  fishingMethod: FishingMethodOption;
  notes: string;
  weight: number;
  date: string;
  createdAt: string;
}

/** 新建记录表单值 */
export interface RecordFormValues {
  fishSpeciesId: string;
  spot: string;
  weather: WeatherOption;
  fishingMethod: FishingMethodOption;
  notes: string;
  weight: number;
  date: Date;
}
