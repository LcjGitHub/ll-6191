import { AppShell, Group, Title, Button, Container } from '@mantine/core';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { IconFish, IconPlus } from '@tabler/icons-react';

/** 应用布局：顶栏导航 + 内容区 */
export function Layout() {
  const location = useLocation();
  const isNewPage = location.pathname === '/new';

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Container size="sm" h="100%">
          <Group h="100%" justify="space-between">
            <Group gap="xs">
              <IconFish size={28} color="var(--mantine-color-teal-6)" />
              <Title order={3} c="teal.8">
                淡水钓鱼记录
              </Title>
            </Group>
            {!isNewPage && (
              <Button
                component={Link}
                to="/new"
                leftSection={<IconPlus size={16} />}
                variant="light"
                color="teal"
              >
                新建记录
              </Button>
            )}
            {isNewPage && (
              <Button component={Link} to="/" variant="subtle" color="gray">
                返回时间线
              </Button>
            )}
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="sm">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
