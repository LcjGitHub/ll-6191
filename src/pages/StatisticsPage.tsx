import {
  Title,
  Text,
  Card,
  Stack,
  Group,
  Paper,
  Progress,
  Badge,
  SimpleGrid,
  Center,
} from '@mantine/core';
import {
  IconChartBar,
  IconScale,
  IconCalendarStats,
  IconFish,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRecordStore } from '@/store/recordStore';
import { calculateSummary, calculateSpeciesStats } from '@/utils/statistics';

const BAR_COLORS = [
  'teal',
  'blue',
  'violet',
  'cyan',
  'green',
  'yellow',
  'orange',
  'red',
  'pink',
  'grape',
];

/** 钓获统计概览页 */
export function StatisticsPage() {
  const records = useRecordStore((state) => state.records);
  const summary = calculateSummary(records);
  const speciesStats = calculateSpeciesStats(records);

  if (records.length === 0) {
    return (
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <Center>
          <Stack align="center" gap="md">
            <IconChartBar size={48} color="var(--mantine-color-gray-5)" stroke={1.5} />
            <Title order={4} c="dimmed">
              暂无统计数据
            </Title>
            <Text size="sm" c="dimmed">
              先添加一些钓鱼记录吧
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      <div>
        <Title order={4}>钓获统计概览</Title>
        <Text size="sm" c="dimmed">
          统计截止 {dayjs().format('YYYY年M月D日 HH:mm')}
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card withBorder shadow="sm" radius="md" padding="lg">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">
              总钓获次数
            </Text>
            <IconCalendarStats size={20} color="var(--mantine-color-teal-6)" />
          </Group>
          <Group gap="xs" align="flex-end">
            <Text size="2rem" fw={700} lh={1}>
              {summary.totalCount}
            </Text>
            <Text size="sm" c="dimmed" pb={4}>
              次
            </Text>
          </Group>
        </Card>

        <Card withBorder shadow="sm" radius="md" padding="lg">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">
              累计总重量
            </Text>
            <IconScale size={20} color="var(--mantine-color-blue-6)" />
          </Group>
          <Group gap="xs" align="flex-end">
            <Text size="2rem" fw={700} lh={1}>
              {summary.totalWeight.toFixed(2)}
            </Text>
            <Text size="sm" c="dimmed" pb={4}>
              kg
            </Text>
          </Group>
        </Card>

        <Card withBorder shadow="sm" radius="md" padding="lg">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">
              本月钓获次数
            </Text>
            <IconFish size={20} color="var(--mantine-color-violet-6)" />
          </Group>
          <Group gap="xs" align="flex-end">
            <Text size="2rem" fw={700} lh={1}>
              {summary.currentMonthCount}
            </Text>
            <Text size="sm" c="dimmed" pb={4}>
              次
            </Text>
          </Group>
        </Card>
      </SimpleGrid>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <IconChartBar size={18} color="var(--mantine-color-teal-6)" />
            <Text fw={600}>各鱼种钓获数量占比</Text>
          </Group>
          <Text size="xs" c="dimmed">
            共 {records.length} 条记录
          </Text>
        </Group>

        <Stack gap="sm">
          {speciesStats.map((stat, index) => (
            <div key={stat.name}>
              <Group justify="space-between" mb={6}>
                <Group gap="xs">
                  <Text size="sm" fw={500}>
                    {stat.name}
                  </Text>
                  <Badge
                    size="sm"
                    variant="light"
                    color={BAR_COLORS[index % BAR_COLORS.length]}
                  >
                    {stat.count} 条
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed">
                  {stat.percentage}%
                </Text>
              </Group>
              <Progress
                value={stat.percentage}
                color={BAR_COLORS[index % BAR_COLORS.length]}
                size="md"
                radius="sm"
              />
            </div>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
