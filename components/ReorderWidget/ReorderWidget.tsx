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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <ActionIcon variant="subtle" color="gray" size="sm" onClick={onMoveUp} disabled={isFirst}>
        <IconArrowUp size={14} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="gray" size="sm" onClick={onMoveDown} disabled={isLast}>
        <IconArrowDown size={14} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="red" size="sm" onClick={onDelete}>
        <IconTrash size={14} />
      </ActionIcon>
    </div>
  );
}
