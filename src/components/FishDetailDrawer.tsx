import { Drawer, Title, Text, Stack, Group, Badge, Paper } from '@mantine/core';
import { IconMapPin, IconFish, IconInfoCircle } from '@tabler/icons-react';
import type { FishSpecies } from '@/types/record';

interface FishDetailDrawerProps {
  opened: boolean;
  onClose: () => void;
  fish: FishSpecies | null;
}

export function FishDetailDrawer({ opened, onClose, fish }: FishDetailDrawerProps) {
  if (!fish) return null;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={
        <Group gap="xs">
          <IconFish size={22} color="var(--mantine-color-teal-6)" />
          <Title order={4}>
            {fish.name}
          </Title>
        </Group>
      }
    >
      <Stack gap="md">
        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <Group gap="xs">
              <IconMapPin size={16} color="var(--mantine-color-teal-6)" />
              <Text fw={600}>栖息地</Text>
            </Group>
            <Badge color="teal" variant="light" size="lg">
              {fish.habitat}
            </Badge>
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <Group gap="xs">
              <IconInfoCircle size={16} color="var(--mantine-color-teal-6)" />
              <Text fw={600}>简介</Text>
            </Group>
            <Text c="dimmed" style={{ lineHeight: 1.8 }}>
              {fish.description}
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Drawer>
  );
}
