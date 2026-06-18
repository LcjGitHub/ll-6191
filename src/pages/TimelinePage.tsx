import {
  Title,
  Text,
  Timeline,
  Badge,
  Paper,
  Stack,
  Group,
  ActionIcon,
  Button,
  Center,
  Select,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import {
  IconFish,
  IconCloud,
  IconMapPin,
  IconScale,
  IconTrash,
  IconPlus,
  IconClipboard,
  IconFilterOff,
} from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { getSortedRecords, useRecordStore } from '@/store/recordStore';
import { WEATHER_COLORS, WEATHER_OPTIONS } from '@/constants/weather';
import { FISHING_METHOD_COLORS, FISHING_METHOD_OPTIONS } from '@/constants/fishingMethod';
import { getFishSpecies } from '@/utils/fishSpecies';
import { filterRecords, hasActiveFilter } from '@/utils/filter';
import type { WeatherOption } from '@/types/record';

const VALID_FISHING_METHODS = new Set(FISHING_METHOD_OPTIONS);

const fishOptions = getFishSpecies().map((species) => ({
  value: species.id,
  label: species.name,
}));

const weatherOptions = WEATHER_OPTIONS.map((w) => ({
  value: w,
  label: w,
}));

/** 钓鱼记录时间线页 */
export function TimelinePage() {
  const records = useRecordStore((state) => state.records);
  const removeRecord = useRecordStore((state) => state.removeRecord);
  const sortedRecords = getSortedRecords(records);

  const [selectedFish, setSelectedFish] = useState<string | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    return filterRecords(sortedRecords, {
      fishSpeciesId: selectedFish,
      weather: selectedWeather as WeatherOption | null,
    });
  }, [sortedRecords, selectedFish, selectedWeather]);

  const activeFilter = hasActiveFilter({
    fishSpeciesId: selectedFish,
    weather: selectedWeather as WeatherOption | null,
  });

  const handleClearFilter = () => {
    setSelectedFish(null);
    setSelectedWeather(null);
  };

  if (sortedRecords.length === 0) {
    return (
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <Center>
          <Stack align="center" gap="md">
            <IconFish size={48} color="var(--mantine-color-gray-5)" stroke={1.5} />
            <Title order={4} c="dimmed">
              暂无钓鱼记录
            </Title>
            <Text size="sm" c="dimmed">
              开始记录你的第一次钓获吧
            </Text>
            <Button
              component={Link}
              to="/new"
              color="teal"
              leftSection={<IconPlus size={16} />}
            >
              新建记录
            </Button>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      <div>
        <Title order={4}>钓鱼时间线</Title>
        <Text size="sm" c="dimmed">
          共 {filteredRecords.length} 条记录，按日期倒序排列
        </Text>
      </div>

      <Paper withBorder p="md" radius="md">
        <Group grow align="flex-end">
          <Select
            label="按鱼种筛选"
            placeholder="选择鱼种"
            data={fishOptions}
            searchable
            value={selectedFish}
            onChange={setSelectedFish}
            leftSection={<IconFish size={16} />}
            clearable
            nothingFoundMessage="未找到鱼种"
          />
          <Select
            label="按天气筛选"
            placeholder="选择天气"
            data={weatherOptions}
            value={selectedWeather}
            onChange={setSelectedWeather}
            leftSection={<IconCloud size={16} />}
            clearable
          />
          {activeFilter && (
            <Button
              variant="light"
              color="gray"
              leftSection={<IconFilterOff size={16} />}
              onClick={handleClearFilter}
            >
              清除筛选
            </Button>
          )}
        </Group>
      </Paper>

      {filteredRecords.length === 0 ? (
        <Paper withBorder shadow="sm" p="xl" radius="md">
          <Center>
            <Stack align="center" gap="md">
              <IconFilterOff size={48} color="var(--mantine-color-gray-5)" stroke={1.5} />
              <Title order={4} c="dimmed">
                没有符合条件的记录
              </Title>
              <Text size="sm" c="dimmed">
                试试调整筛选条件，或清除筛选查看全部
              </Text>
              <Button
                variant="light"
                color="gray"
                leftSection={<IconFilterOff size={16} />}
                onClick={handleClearFilter}
              >
                清除筛选
              </Button>
            </Stack>
          </Center>
        </Paper>
      ) : (
        <Timeline active={filteredRecords.length} bulletSize={28} lineWidth={2} color="teal">
          {filteredRecords.map((record) => (
            <Timeline.Item
              key={record.id}
              bullet={<IconFish size={14} />}
              title={
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="xs">
                    <Text fw={600}>{record.fishSpeciesName}</Text>
                    <Badge color={WEATHER_COLORS[record.weather]} variant="light" size="sm">
                      {record.weather}
                    </Badge>
                    {record.fishingMethod && VALID_FISHING_METHODS.has(record.fishingMethod) && (
                      <Badge color={FISHING_METHOD_COLORS[record.fishingMethod]} variant="light" size="sm">
                        {record.fishingMethod}
                      </Badge>
                    )}
                  </Group>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    aria-label="删除记录"
                    onClick={() => removeRecord(record.id)}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              }
            >
              <Stack gap={4} mt={4}>
                <Group gap={6}>
                  <IconScale size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="sm">{record.weight} kg</Text>
                </Group>
                <Group gap={6} align="flex-start">
                  <IconMapPin size={14} color="var(--mantine-color-dimmed)" style={{ marginTop: 2 }} />
                  <Text size="sm" c="dimmed" style={{ flex: 1 }}>
                    {record.spot}
                  </Text>
                </Group>
                {record.notes && (
                  <Group gap={6} align="flex-start">
                    <IconClipboard size={14} color="var(--mantine-color-dimmed)" style={{ marginTop: 2 }} />
                    <Text size="sm" c="dimmed" style={{ flex: 1 }} lineClamp={2}>
                      {record.notes}
                    </Text>
                  </Group>
                )}
                <Group gap={6}>
                  <IconCloud size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="xs" c="dimmed">
                    {dayjs(record.date).format('YYYY年M月D日')}
                    {' · '}
                    记录于 {dayjs(record.createdAt).format('M月D日 HH:mm')}
                  </Text>
                </Group>
              </Stack>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Stack>
  );
}
