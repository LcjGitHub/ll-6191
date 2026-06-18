import {
  Stack,
  Select,
  Textarea,
  NumberInput,
  Button,
  Paper,
  Title,
  Text,
  Group,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { IconCalendar, IconCloud, IconScale, IconFish, IconStar, IconAnchor, IconClipboard } from '@tabler/icons-react';
import { useState } from 'react';
import { recordFormSchema, type RecordFormSchema } from '@/schemas/recordSchema';
import { WEATHER_OPTIONS } from '@/constants/weather';
import { FISHING_METHOD_OPTIONS } from '@/constants/fishingMethod';
import { getFishSpecies, getFishSpeciesById } from '@/utils/fishSpecies';
import { useRecordStore } from '@/store/recordStore';
import { useFavoriteStore } from '@/store/favoriteStore';

const fishOptions = getFishSpecies().map((species) => ({
  value: species.id,
  label: species.name,
}));

/** 新建钓鱼记录表单 */
export function RecordForm() {
  const navigate = useNavigate();
  const addRecord = useRecordStore((state) => state.addRecord);
  const favorites = useFavoriteStore((state) => state.favorites);
  const [favoriteValue, setFavoriteValue] = useState<string | null>(null);

  const favoriteOptions = favorites.map((f) => ({
    value: f.name,
    label: f.name,
  }));

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RecordFormSchema>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      fishSpeciesId: '',
      spot: '',
      weather: undefined,
      fishingMethod: undefined,
      notes: '',
      weight: undefined,
      date: new Date(),
    },
  });

  const onSubmit = handleSubmit((values) => {
    const species = getFishSpeciesById(values.fishSpeciesId);
    if (!species) return;

    addRecord({
      fishSpeciesId: values.fishSpeciesId,
      fishSpeciesName: species.name,
      spot: values.spot.trim(),
      weather: values.weather,
      fishingMethod: values.fishingMethod,
      notes: values.notes.trim(),
      weight: values.weight,
      date: dayjs(values.date).format('YYYY-MM-DD'),
    });

    navigate('/');
  });

  return (
    <Paper withBorder shadow="sm" p="lg" radius="md">
      <Stack gap="md">
        <div>
          <Title order={4}>新建钓鱼记录</Title>
          <Text size="sm" c="dimmed">
            填写钓获信息，保存后将出现在时间线中
          </Text>
        </div>

        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <Controller
              name="fishSpeciesId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="鱼种"
                  placeholder="选择鱼种"
                  data={fishOptions}
                  searchable
                  leftSection={<IconFish size={16} />}
                  error={errors.fishSpeciesId?.message}
                  nothingFoundMessage="未找到鱼种"
                />
              )}
            />

            <Controller
              name="spot"
              control={control}
              render={({ field }) => (
                <Stack gap="md">
                  <Textarea
                    {...field}
                    label="钓点"
                    description="描述钓点位置"
                    placeholder="如：城东水库北岸浅滩"
                    minRows={3}
                    autosize
                    error={errors.spot?.message}
                  />
                  {favoriteOptions.length > 0 && (
                    <Select
                      label="从收藏填入"
                      placeholder="选择收藏的钓点"
                      data={favoriteOptions}
                      searchable
                      value={favoriteValue}
                      leftSection={<IconStar size={16} />}
                      onChange={(value) => {
                        if (value) {
                          setValue('spot', value, { shouldDirty: true });
                        }
                        setFavoriteValue(null);
                      }}
                      nothingFoundMessage="未找到收藏钓点"
                    />
                  )}
                </Stack>
              )}
            />

            <Controller
              name="weather"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="天气"
                  placeholder="选择天气"
                  data={[...WEATHER_OPTIONS]}
                  leftSection={<IconCloud size={16} />}
                  error={errors.weather?.message}
                />
              )}
            />

            <Controller
              name="fishingMethod"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="钓法"
                  placeholder="选择钓法"
                  data={[...FISHING_METHOD_OPTIONS]}
                  leftSection={<IconAnchor size={16} />}
                  error={errors.fishingMethod?.message}
                />
              )}
            />

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="备注"
                  description="可选，不超过 200 字"
                  placeholder="记录本次作钓的备注信息"
                  minRows={2}
                  maxRows={4}
                  autosize
                  maxLength={200}
                  leftSection={<IconClipboard size={16} />}
                  error={errors.notes?.message}
                />
              )}
            />

            <Controller
              name="weight"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <NumberInput
                  {...field}
                  label="重量 (kg)"
                  placeholder="0.0"
                  decimalScale={2}
                  min={0}
                  step={0.1}
                  value={value ?? ''}
                  onChange={(val) => onChange(typeof val === 'number' ? val : undefined)}
                  leftSection={<IconScale size={16} />}
                  error={errors.weight?.message}
                />
              )}
            />

            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePickerInput
                  {...field}
                  label="日期"
                  placeholder="选择日期"
                  leftSection={<IconCalendar size={16} />}
                  maxDate={new Date()}
                  valueFormat="YYYY-MM-DD"
                  error={errors.date?.message}
                />
              )}
            />

            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={() => navigate('/')}>
                取消
              </Button>
              <Button type="submit" color="teal" loading={isSubmitting}>
                保存记录
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
