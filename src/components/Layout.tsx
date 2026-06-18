import { AppShell, Group, Title, Button, Container, SegmentedControl, Box } from '@mantine/core';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IconFish, IconPlus, IconChartBar, IconTimeline } from '@tabler/icons-react';

/** 应用布局：顶栏导航 + 内容区 */
export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isNewPage = location.pathname === '/new';
  const isStatisticsPage = location.pathname === '/统计';

  const navValue = isStatisticsPage ? 'statistics' : 'timeline';

  const handleNavChange = (value: string) => {
    if (value === 'statistics') {
      navigate('/统计');
    } else {
      navigate('/');
    }
  };

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Container size="sm" h="100%">
          <Group h="100%" justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <IconFish size={28} color="var(--mantine-color-teal-6)" />
              <Title order={3} c="teal.8">
                淡水钓鱼记录
              </Title>
            </Group>

            {!isNewPage && (
              <Box style={{ flex: 1 }} mx="sm">
                <Group justify="center">
                  <SegmentedControl
                    value={navValue}
                    onChange={handleNavChange}
                    data={[
                      {
                        value: 'timeline',
                        label: (
                          <Group gap={6} wrap="nowrap">
                            <IconTimeline size={14} />
                            <Box>时间线</Box>
                          </Group>
                        ),
                      },
                      {
                        value: 'statistics',
                        label: (
                          <Group gap={6} wrap="nowrap">
                            <IconChartBar size={14} />
                            <Box>统计</Box>
                          </Group>
                        ),
                      },
                    ]}
                    color="teal"
                    size="sm"
                  />
                </Group>
              </Box>
            )}

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
