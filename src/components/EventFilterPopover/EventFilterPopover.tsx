'use client';

import { Button, Checkbox, Popover, SimpleGrid, Text } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';

const categories: string[] = ['Yoga', 'Meditation', 'Fitness'];

interface EventFilterPopoverProps {
  inclCategory: string[];
  setInclCategory: (categories: string[]) => void;
}

export default function EventFilterPopover({
  inclCategory,
  setInclCategory,
}: EventFilterPopoverProps) {
  return (
    <Popover width={300} position="bottom-end" shadow="md">
      <Popover.Target>
        <Button
          leftSection={<IconFilter size={20} />}
          variant="default"
          styles={{
            root: {
              float: 'right',
            },
          }}
        >
          Filter
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text
          style={{
            marginBottom: '1rem',
          }}
          fw={700}
        >
          Event Category
        </Text>
        <SimpleGrid cols={2}>
          {categories.map((category) => (
            <Checkbox
              key={category}
              label={category}
              checked={inclCategory.includes(category)}
              onChange={(event) => {
                if (event.currentTarget.checked) {
                  setInclCategory([...inclCategory, category]);
                } else {
                  setInclCategory(inclCategory.filter((c) => c !== category));
                }
              }}
            />
          ))}
        </SimpleGrid>
      </Popover.Dropdown>
    </Popover>
  );
}
