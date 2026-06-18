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
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { getSortedRecords, useRecordStore } from '@/store/recordStore';
import { WEATHER_COLORS } from '@/constants/weather';
import { FISHING_METHOD_COLORS } from '@/constants/fishingMethod';

/** 钓鱼记录时间线页 */
export function TimelinePage() {
  const records = useRecordStore((state) => state.records);
  const removeRecord = useRecordStore((state) => state.removeRecord);
  const sortedRecords = getSortedRecords(records);

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
          共 {sortedRecords.length} 条记录，按日期倒序排列
        </Text>
      </div>

      <Timeline active={sortedRecords.length} bulletSize={28} lineWidth={2} color="teal">
        {sortedRecords.map((record) => (
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
                  <Badge color={FISHING_METHOD_COLORS[record.fishingMethod]} variant="light" size="sm">
                    {record.fishingMethod}
                  </Badge>
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
    </Stack>
  );
}
