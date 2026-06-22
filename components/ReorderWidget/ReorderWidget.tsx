import React from 'react';
import { ActionIcon } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconTrash } from '@tabler/icons-react';

interface ReorderWidgetProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ReorderWidget({ onMoveUp, onMoveDown, onDelete, isFirst, isLast }: ReorderWidgetProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        border: '1px solid var(--mantine-color-gray-4)',
        borderRadius: '8px',
        padding: '2px',
        backgroundColor: 'var(--mantine-color-white)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ActionIcon variant="subtle" color="black" size="lg" onClick={onMoveUp} disabled={isFirst}>
        <IconArrowUp size={20} stroke={3} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="black" size="lg" onClick={onMoveDown} disabled={isLast}>
        <IconArrowDown size={20} stroke={3} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="red" size="lg" onClick={onDelete}>
        <IconTrash size={20} stroke={2} />
      </ActionIcon>
    </div>
  );
}
