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
import { useNavigate, useParams } from 'react-router-dom';
import { IconCalendar, IconCloud, IconScale, IconFish, IconStar, IconAnchor, IconClipboard } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
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

interface RecordFormProps {
  mode?: 'create' | 'edit';
}

/** 钓鱼记录表单，支持新建和编辑模式 */
export function RecordForm({ mode = 'create' }: RecordFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const addRecord = useRecordStore((state) => state.addRecord);
  const updateRecord = useRecordStore((state) => state.updateRecord);
  const records = useRecordStore((state) => state.records);
  const favorites = useFavoriteStore((state) => state.favorites);
  const [favoriteValue, setFavoriteValue] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const isEditMode = mode === 'edit';
  const editingRecord = isEditMode && id && hasHydrated
    ? records.find((r) => r.id === id)
    : undefined;

  const favoriteOptions = favorites.map((f) => ({
    value: f.name,
    label: f.name,
  }));

  const {
    control,
    handleSubmit,
    setValue,
    reset,
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

  useEffect(() => {
    if (useRecordStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }
    const unsub = useRecordStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (isEditMode && hasHydrated && editingRecord) {
      reset({
        fishSpeciesId: editingRecord.fishSpeciesId,
        spot: editingRecord.spot,
        weather: editingRecord.weather,
        fishingMethod: editingRecord.fishingMethod,
        notes: editingRecord.notes,
        weight: editingRecord.weight,
        date: dayjs(editingRecord.date).toDate(),
      });
    }
  }, [isEditMode, hasHydrated, editingRecord, reset]);

  const onSubmit = handleSubmit((values) => {
    const species = getFishSpeciesById(values.fishSpeciesId);
    if (!species) return;

    const recordData = {
      fishSpeciesId: values.fishSpeciesId,
      fishSpeciesName: species.name,
      spot: values.spot.trim(),
      weather: values.weather,
      fishingMethod: values.fishingMethod,
      notes: values.notes.trim(),
      weight: values.weight,
      date: dayjs(values.date).format('YYYY-MM-DD'),
    };

    if (isEditMode && id) {
      updateRecord(id, recordData);
    } else {
      addRecord(recordData);
    }

    navigate('/');
  });

  if (isEditMode && !hasHydrated) {
    return (
      <Paper withBorder shadow="sm" p="lg" radius="md">
        <Text c="dimmed">加载中...</Text>
      </Paper>
    );
  }

  if (isEditMode && !editingRecord) {
    return (
      <Paper withBorder shadow="sm" p="lg" radius="md">
        <Text c="dimmed">未找到该记录</Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder shadow="sm" p="lg" radius="md">
      <Stack gap="md">
        <div>
          <Title order={4}>{isEditMode ? '编辑钓鱼记录' : '新建钓鱼记录'}</Title>
          <Text size="sm" c="dimmed">
            {isEditMode ? '修改钓获信息，保存后将更新时间线中的记录' : '填写钓获信息，保存后将出现在时间线中'}
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
                {isEditMode ? '保存修改' : '保存记录'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
