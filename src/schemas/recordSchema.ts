import { z } from 'zod';
import { WEATHER_OPTIONS } from '@/constants/weather';
import { FISHING_METHOD_OPTIONS } from '@/constants/fishingMethod';

/** 新建钓鱼记录表单校验 */
export const recordFormSchema = z.object({
  fishSpeciesId: z.string().min(1, '请选择鱼种'),
  spot: z.string().min(1, '请填写钓点').max(500, '钓点描述不超过 500 字'),
  weather: z.enum(WEATHER_OPTIONS, { required_error: '请选择天气' }),
  fishingMethod: z.enum(FISHING_METHOD_OPTIONS, { required_error: '请选择钓法' }),
  notes: z.string().max(200, '备注不超过 200 字').default(''),
  weight: z
    .number({ invalid_type_error: '请输入有效重量' })
    .positive('重量必须大于 0')
    .max(999, '重量不超过 999 kg'),
  date: z.date({ required_error: '请选择日期', invalid_type_error: '请选择有效日期' }),
});

export type RecordFormSchema = z.infer<typeof recordFormSchema>;
