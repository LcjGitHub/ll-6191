import fishSpeciesData from '@/mock/fish-species.json';
import type { FishSpecies } from '@/types/record';

/** 获取全部鱼种 Mock 数据 */
export function getFishSpecies(): FishSpecies[] {
  return fishSpeciesData as FishSpecies[];
}

/** 按 id 查找鱼种 */
export function getFishSpeciesById(id: string): FishSpecies | undefined {
  return getFishSpecies().find((species) => species.id === id);
}
