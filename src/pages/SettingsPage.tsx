import {
  Title,
  Text,
  Paper,
  Stack,
  Button,
  Group,
  Modal,
  Divider,
  Notification,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDownload, IconUpload, IconSettings } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecordStore } from '@/store/recordStore';
import {
  downloadRecordsAsFile,
  parseImportedText,
  mergeRecords,
  calculateMergeStats,
  type ParseResult,
} from '@/utils/importExport';
import type { FishingRecord } from '@/types/record';

export function SettingsPage() {
  const navigate = useNavigate();
  const records = useRecordStore((state) => state.records);
  const importRecords = useRecordStore((state) => state.importRecords);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const [pendingImport, setPendingImport] = useState<FishingRecord[] | null>(null);
  const [pendingParseResult, setPendingParseResult] = useState<ParseResult | null>(null);
  const [pendingStats, setPendingStats] = useState<{ newCount: number; duplicateCount: number } | null>(null);
  const [fileName, setFileName] = useState('');

  const handleExport = () => {
    if (records.length === 0) {
      setError('暂无记录可导出');
      return;
    }
    downloadRecordsAsFile(records);
    setSuccess(`已导出 ${records.length} 条记录`);
    setError('');
    setWarning('');
  };

  const handleImportClick = () => {
    setError('');
    setSuccess('');
    setWarning('');
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setSuccess('');
    setWarning('');

    try {
      const text = await file.text();
      const result = parseImportedText(text);
      if (result.validRecords.length === 0) {
        setError('文件中没有有效的记录');
        return;
      }
      if (result.invalidCount > 0) {
        setWarning(`检测到 ${result.invalidCount} 条无效记录已被过滤，仅导入 ${result.validRecords.length} 条有效记录`);
      }
      const stats = calculateMergeStats(records, result.validRecords);
      setPendingImport(result.validRecords);
      setPendingParseResult(result);
      setPendingStats(stats);
      openConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入失败');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const confirmImport = () => {
    if (!pendingImport || !pendingParseResult || !pendingStats) return;

    const stats = pendingStats;
    closeConfirm();
    setPendingImport(null);
    setPendingParseResult(null);
    setPendingStats(null);

    const merged = mergeRecords(records, pendingImport);
    importRecords(merged);

    setSuccess(
      stats.newCount > 0
        ? `导入成功，新增 ${stats.newCount} 条记录`
        : '导入完成，没有新增记录（已全部存在）',
    );

    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  const cancelImport = () => {
    closeConfirm();
    setPendingImport(null);
    setPendingParseResult(null);
    setPendingStats(null);
  };

  return (
    <Stack gap="md">
      <div>
        <Title order={4}>设置</Title>
        <Text size="sm" c="dimmed">
          数据备份与恢复
        </Text>
      </div>

      {error && (
        <Notification color="red" onClose={() => setError('')} withCloseButton>
          {error}
        </Notification>
      )}
      {warning && (
        <Notification color="orange" onClose={() => setWarning('')} withCloseButton>
          {warning}
        </Notification>
      )}
      {success && (
        <Notification color="teal" onClose={() => setSuccess('')} withCloseButton>
          {success}
        </Notification>
      )}

      <Paper withBorder shadow="sm" p="md" radius="md">
        <Stack gap="md">
          <Group gap="xs" wrap="nowrap">
            <IconSettings size={20} color="var(--mantine-color-teal-6)" />
            <Text fw={600}>数据备份与恢复</Text>
          </Group>

          <Divider />

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              导出数据
            </Text>
            <Text size="xs" c="dimmed">
              将全部钓鱼记录导出为文本文件，可用于备份或迁移
            </Text>
            <Button
              color="teal"
              leftSection={<IconDownload size={16} />}
              onClick={handleExport}
            >
              导出全部记录
            </Button>
            <Text size="xs" c="dimmed">
              当前共有 {records.length} 条记录
            </Text>
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              导入数据
            </Text>
            <Text size="xs" c="dimmed">
              从文本文件导入记录，将按唯一标识与已有记录合并去重
            </Text>
            <Button
              variant="light"
              color="teal"
              leftSection={<IconUpload size={16} />}
              onClick={handleImportClick}
            >
              选择文件导入
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Stack>
        </Stack>
      </Paper>

      <Modal
        opened={confirmOpened}
        onClose={cancelImport}
        title="确认导入"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            文件
            <Text span fw={600}>
              「{fileName}」
            </Text>
          </Text>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              文件记录总数
            </Text>
            <Text size="sm" fw={600}>
              {pendingParseResult?.totalCount ?? 0} 条
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              无效记录（已过滤）
            </Text>
            <Text size="sm" fw={600} c="orange">
              {pendingParseResult?.invalidCount ?? 0} 条
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              预计新增
            </Text>
            <Text size="sm" fw={600} c="teal">
              {pendingStats?.newCount ?? 0} 条
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              重复跳过
            </Text>
            <Text size="sm" fw={600} c="gray">
              {pendingStats?.duplicateCount ?? 0} 条
            </Text>
          </Group>
          <Group justify="flex-end" gap="xs">
            <Button variant="default" onClick={cancelImport}>
              取消
            </Button>
            <Button color="teal" onClick={confirmImport}>
              确认导入
            </Button>
          </Group>
        </Stack>
      </Modal>

    </Stack>
  );
}
