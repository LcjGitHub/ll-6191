import { useState } from 'react';
import { Title, Text, SimpleGrid, Card, Badge, Group, Stack } from '@mantine/core';
import { IconFish, IconMapPin, IconChevronRight } from '@tabler/icons-react';
import { getFishSpecies } from '@/utils/fishSpecies';
import { FishDetailDrawer } from '@/components/FishDetailDrawer';
import type { FishSpecies } from '@/types/record';

export function FishGuidePage() {
  const fishList = getFishSpecies();
  const [selectedFish, setSelectedFish] = useState<FishSpecies | null>(null);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const handleCardClick = (fish: FishSpecies) => {
    setSelectedFish(fish);
    setDrawerOpened(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpened(false);
  };

  return (
    <>
      <Stack gap="md">
        <div>
          <Title order={4}>鱼种图鉴</Title>
          <Text size="sm" c="dimmed">
            共收录 {fishList.length} 种常见淡水鱼，点击卡片查看详情
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {fishList.map((fish) => (
            <Card
              key={fish.id}
              withBorder
              shadow="sm"
              padding="md"
              radius="md"
              role="button"
              tabIndex={0}
              aria-label={`查看${fish.name}详情`}
              onClick={() => handleCardClick(fish)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(fish);
                }
              }}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
              }}
            >
              <Group justify="space-between" wrap="nowrap" mb="xs">
                <Group gap="xs" wrap="nowrap">
                  <IconFish size={20} color="var(--mantine-color-teal-6)" />
                  <Text fw={600} size="lg">
                    {fish.name}
                  </Text>
                </Group>
                <IconChevronRight size={18} color="var(--mantine-color-gray-4)" />
              </Group>

              <Group gap="xs" mb="sm">
                <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
                <Badge color="teal" variant="light" size="sm" aria-label={`栖息地：${fish.habitat}`}>
                  {fish.habitat}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" lineClamp={2}>
                {fish.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>

      <FishDetailDrawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        fish={selectedFish}
      />
    </>
  );
}
