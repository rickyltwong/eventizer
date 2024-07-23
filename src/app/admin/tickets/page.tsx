'use client';

import {
  Anchor,
  Container,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';

import { OrdersTable, PageHeader } from '@/components';
import { useFetchData } from '@/hooks';
import { PATH_DASHBOARD } from '@/routes';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Tickets', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

export default function Page() {
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
  } = useFetchData('/admin/api/tickets');

  return (
    <>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Tickets" breadcrumbItems={items} />
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Tickets
              </Text>
              {/* <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon> */}
            </Group>
            <OrdersTable
              data={ordersData}
              error={ordersError}
              loading={ordersLoading}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
