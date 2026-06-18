import {
  Title,
  Text,
  Paper,
  Stack,
  Group,
  ActionIcon,
  TextInput,
  Button,
  Center,
  Divider,
} from '@mantine/core';
import { IconStar, IconTrash, IconPlus, IconMapPin } from '@tabler/icons-react';
import { useState } from 'react';
import { useFavoriteStore } from '@/store/favoriteStore';

export function FavoritesPage() {
  const favorites = useFavoriteStore((state) => state.favorites);
  const addFavorite = useFavoriteStore((state) => state.addFavorite);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (favorites.some((f) => f.name === trimmed)) {
      setNewName('');
      return;
    }
    addFavorite(trimmed);
    setNewName('');
  };

  return (
    <Stack gap="md">
      <div>
        <Title order={4}>钓点收藏</Title>
        <Text size="sm" c="dimmed">
          管理常用钓点，新建记录时可快速填入
        </Text>
      </div>

      <Paper withBorder shadow="sm" p="md" radius="md">
        <Group gap="xs">
          <TextInput
            placeholder="输入钓点名称"
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
            }}
            style={{ flex: 1 }}
            leftSection={<IconMapPin size={16} />}
          />
          <Button
            color="teal"
            leftSection={<IconPlus size={16} />}
            onClick={handleAdd}
            disabled={!newName.trim()}
          >
            添加
          </Button>
        </Group>
      </Paper>

      <Divider />

      {favorites.length === 0 ? (
        <Paper withBorder shadow="sm" p="xl" radius="md">
          <Center>
            <Stack align="center" gap="md">
              <IconStar size={48} color="var(--mantine-color-gray-5)" stroke={1.5} />
              <Title order={4} c="dimmed">
                暂无收藏钓点
              </Title>
              <Text size="sm" c="dimmed">
                在上方输入钓点名称添加收藏
              </Text>
            </Stack>
          </Center>
        </Paper>
      ) : (
        <Stack gap="xs">
          {favorites.map((fav) => (
            <Paper key={fav.id} withBorder p="sm" radius="md">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="xs" wrap="nowrap">
                  <IconStar size={16} color="var(--mantine-color-teal-6)" />
                  <Text size="sm" fw={500}>
                    {fav.name}
                  </Text>
                </Group>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  aria-label="删除收藏"
                  onClick={() => removeFavorite(fav.id)}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
