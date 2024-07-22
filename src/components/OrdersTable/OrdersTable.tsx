// 'use client';

import {
  ActionIcon,
  Badge,
  NumberInput,
  Select,
  TextInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCheck, IconEdit, IconSearch } from '@tabler/icons-react';
import axios from 'axios';
import sortBy from 'lodash/sortBy';
import {
  DataTable,
  DataTableProps,
  DataTableSortStatus,
} from 'mantine-datatable';
import {
  useEffect,
  // useMemo,
  useState,
} from 'react';

import { ErrorAlert } from '@/components';
import { Ticket, TicketStatus } from '@/types';

type StatusBadgeProps = {
  status: TicketStatus;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let color = '';

  switch (status) {
    case 'Pending':
      color = 'blue';
      break;
    case 'Pre-Sale':
      color = 'violet';
      break;
    case 'Available':
      color = 'green';
      break;
    case 'Sold':
      color = 'gray';
      break;
    case 'Cancelled':
      color = 'red';
      break;
    default:
      color = 'gray';
  }

  return (
    <Badge color={color} variant="filled" radius="sm">
      {status}
    </Badge>
  );
};

const PAGE_SIZES = [5, 10, 20];

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Pre-Sale', label: 'Pre-Sale' },
  { value: 'Available', label: 'Available' },
  { value: 'Sold', label: 'Sold' },
  { value: 'Cancelled', label: 'Cancelled' },
];

type OrdersTableProps = {
  data: Ticket[];
  error?: React.ReactNode;
  loading?: boolean;
  // onUpdate: (updatedTickets: Ticket[]) => void;
};

const OrdersTable = ({
  data,
  loading,
  error,
  // , onUpdate
}: OrdersTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [records, setRecords] = useState<Ticket[]>(data.slice(0, pageSize));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Ticket>>({
    columnAccessor: 'event.eventName',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  // const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedRecord, setEditedRecord] = useState<Ticket | null>(null);

  // const statuses = useMemo(() => {
  //   const statuses = new Set(data.map((e) => e.status));
  //   return [...statuses];
  // }, [data]);

  const handleEditClick = (ticket: Ticket) => {
    setEditMode(ticket._id.toString());
    setEditedRecord(ticket);
  };

  const handleSubmitClick = async (ticket: Ticket) => {
    try {
      const payload = { id: ticket._id, ...editedRecord };
      const response = await axios.put('/admin/api/tickets', payload);
      console.log('Update response:', response.data);

      if (response.data && response.data.tickets) {
        // Update the records state with the new data
        const updatedTickets = response.data.tickets;
        setRecords(updatedTickets);

        // Call the onUpdate prop to update the parent component
        // if (onUpdate) {
        //   onUpdate(updatedTickets);
        // }
      }

      // Refetch the data to ensure consistency
      const refetchedData = await axios.get('/admin/api/tickets');
      setRecords(refetchedData.data);

      setEditMode(null);
      setEditedRecord(null);
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  const calculateRemainingTickets = (item: Ticket) => {
    const capacity = item.event.capacity;
    const sold = item.sold;
    if (item.type === 'vip') {
      return capacity * 0.2 - sold;
    } else if (item.type === 'general') {
      return capacity * 0.8 - sold;
    }
    return 'N/A';
  };

  const columns: DataTableProps<Ticket>['columns'] = [
    {
      accessor: 'event.eventName',
      title: 'Event',
      sortable: true,
      filter: (
        <TextInput
          label="Events"
          description="Show events whose names include the specified text"
          placeholder="Search events..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      ),
      filtering: query !== '',
    },
    {
      accessor: 'type',
    },
    {
      accessor: 'markedPrice',
      sortable: true,
      render: (item: Ticket) =>
        editMode === item._id ? (
          <NumberInput
            value={editedRecord?.markedPrice ?? item.markedPrice ?? 0}
            onChange={(value) =>
              setEditedRecord((prev) =>
                prev ? { ...prev, markedPrice: value as number } : null,
              )
            }
          />
        ) : (
          <span>${item.markedPrice}</span>
        ),
    },
    {
      accessor: 'price',
      sortable: true,
      render: (item: Ticket) =>
        editMode === item._id ? (
          <NumberInput
            value={editedRecord?.price ?? item.price ?? 0}
            onChange={(value) =>
              setEditedRecord((prev) =>
                prev ? { ...prev, price: value as number } : null,
              )
            }
          />
        ) : (
          <span>${(item.markedPrice ?? 0) * (1 - (item.discount ?? 0))}</span>
        ),
    },
    {
      accessor: 'discount',
      render: (item: Ticket) =>
        editMode === item._id ? (
          <NumberInput
            value={editedRecord?.discount ?? item.discount ?? 0}
            onChange={(value) =>
              setEditedRecord((prev) =>
                prev ? { ...prev, discount: value as number } : null,
              )
            }
            min={0}
            max={1}
            step={0.01}
          />
        ) : (
          <span>{(item.discount ?? 0) * 100}%</span>
        ),
    },
    {
      accessor: 'discountExpiry',
      render: (item: Ticket) =>
        editMode === item._id ? (
          <DateTimePicker
            value={
              editedRecord?.discountExpiry
                ? new Date(editedRecord.discountExpiry)
                : item.discountExpiry
                  ? new Date(item.discountExpiry)
                  : null
            }
            onChange={(value) =>
              setEditedRecord((prev) =>
                prev ? { ...prev, discountExpiry: value?.toISOString() } : null,
              )
            }
          />
        ) : (
          <span>
            {item.discountExpiry
              ? new Date(item.discountExpiry).toLocaleDateString()
              : 'N/A'}
          </span>
        ),
    },
    {
      accessor: 'status',
      render: (item: Ticket) =>
        editMode === item._id ? (
          <Select
            data={statusOptions}
            value={editedRecord?.status || item.status}
            onChange={(value) =>
              setEditedRecord((prev) =>
                prev ? { ...prev, status: value as TicketStatus } : null,
              )
            }
          />
        ) : (
          <StatusBadge status={item.status} />
        ),
    },
    {
      accessor: 'sold',
      sortable: true,
      render: (item: Ticket) =>
        editMode === item._id ? (
          <NumberInput
            value={editedRecord?.sold ?? item.sold ?? 0}
            onChange={(value) =>
              setEditedRecord((prev) =>
                prev ? { ...prev, sold: value as number } : null,
              )
            }
            min={0}
          />
        ) : (
          <span>{item.sold}</span>
        ),
    },
    {
      accessor: 'remain',
      render: (item: Ticket) => (
        <span>
          {item.event?.capacity ? calculateRemainingTickets(item) : 'N/A'}
        </span>
      ),
      sortable: true,
    },
    {
      accessor: 'actions',
      title: '',
      render: (item: Ticket) =>
        editMode === item._id ? (
          <ActionIcon onClick={() => handleSubmitClick(item)}>
            <IconCheck size={16} />
          </ActionIcon>
        ) : (
          <ActionIcon onClick={() => handleEditClick(item)}>
            <IconEdit size={16} />
          </ActionIcon>
        ),
    },
  ];

  //   useEffect(() => {
  //     setPage(1);
  //   }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const sortedData = sortBy(data, sortStatus.columnAccessor) as Ticket[];
    let filtered = sortedData.slice(from, to);

    if (sortStatus.direction === 'desc') {
      filtered = filtered.reverse();
    }

    if (
      debouncedQuery
      // || selectedStatuses.length
    ) {
      filtered = data
        .filter(
          ({
            event,
            // , status
          }) => {
            if (
              debouncedQuery !== '' &&
              !event.eventName
                .toLowerCase()
                .includes(debouncedQuery.trim().toLowerCase())
            ) {
              return false;
            }

            // if (
            //   selectedStatuses.length &&
            //   !selectedStatuses.some((s) => s === status)
            // ) {
            //   return false;
            // }
            return true;
          },
        )
        .slice(from, to);
    }

    setRecords(filtered);
  }, [
    sortStatus,
    data,
    page,
    pageSize,
    debouncedQuery,

    // , selectedStatuses
  ]);

  return error ? (
    <ErrorAlert title="Error loading orders" message={error.toString()} />
  ) : (
    <DataTable<Ticket>
      minHeight={200}
      verticalSpacing="sm"
      striped={true}
      columns={columns}
      records={records}
      totalRecords={
        debouncedQuery
          ? // || selectedStatuses.length > 0
            records.length
          : data.length
      }
      recordsPerPage={pageSize}
      page={page}
      onPageChange={(p) => setPage(p)}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      fetching={loading}
    />
  );
};

export default OrdersTable;
