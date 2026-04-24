'use client';

import { useState, useRef, useCallback, type ReactNode } from 'react';

interface ReorderableItem {
  id: string;
  content: ReactNode;
}

interface ReorderableListProps {
  items: ReorderableItem[];
  className?: string;
  onReorder?: (ids: string[]) => void;
}

export function ReorderableList({ items: initialItems, className = '', onReorder }: ReorderableListProps) {
  const [order, setOrder] = useState(() => initialItems.map(i => i.id));
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const ordered = order
    .map(id => initialItems.find(i => i.id === id))
    .filter((i): i is ReorderableItem => i != null);

  const handleDragStart = useCallback((id: string) => {
    setDragId(id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverId(id);
  }, []);

  const handleDrop = useCallback((targetId: string) => {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setOverId(null);
      return;
    }

    setOrder(prev => {
      const next = [...prev];
      const fromIdx = next.indexOf(dragId);
      const toIdx = next.indexOf(targetId);
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, dragId);
      onReorder?.(next);
      return next;
    });

    setDragId(null);
    setOverId(null);
  }, [dragId, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setOverId(null);
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {ordered.map(item => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDrop={() => handleDrop(item.id)}
          onDragEnd={handleDragEnd}
          className={`
            transition-all duration-200
            ${dragId === item.id ? 'opacity-40 scale-[0.98]' : ''}
            ${overId === item.id && dragId !== item.id ? 'translate-y-1' : ''}
          `}
        >
          {dragId && (
            <div
              className={`h-[2px] -mt-[1px] mb-[var(--space-sm)] rounded-full transition-all duration-150 ${
                overId === item.id && dragId !== item.id ? 'bg-gold' : 'bg-transparent'
              }`}
            />
          )}
          {item.content}
        </div>
      ))}
    </div>
  );
}
