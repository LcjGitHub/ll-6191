import { Modal, Button, Group, Text, Stack } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import dayjs from 'dayjs';

interface DeleteConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onExitTransitionEnd: () => void;
  onConfirm: () => void;
  fishSpeciesName: string;
  date: string;
}

/** 删除钓鱼记录确认对话框 */
export function DeleteConfirmModal({
  opened,
  onClose,
  onExitTransitionEnd,
  onConfirm,
  fishSpeciesName,
  date,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      onExitTransitionEnd={onExitTransitionEnd}
      closeButtonProps={{ 'aria-label': '关闭确认对话框' }}
      title={
        <Group gap="xs">
          <IconAlertTriangle size={20} color="var(--mantine-color-red-6)" />
          <Text fw={600}>确认删除</Text>
        </Group>
      }
      size="sm"
      centered
    >
      <Stack gap="lg">
        <Text size="sm">
          确定要删除这条记录吗？此操作不可撤销。
        </Text>

        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            鱼种：<Text span fw={500} c="dark">{fishSpeciesName}</Text>
          </Text>
          <Text size="sm" c="dimmed">
            日期：<Text span fw={500} c="dark">{dayjs(date).format('YYYY年M月D日')}</Text>
          </Text>
        </Stack>

        <Group justify="flex-end" gap="sm">
          <Button variant="light" color="gray" onClick={onClose}>
            取消
          </Button>
          <Button color="red" onClick={onConfirm}>
            确认删除
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
