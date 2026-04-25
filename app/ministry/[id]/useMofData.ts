'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useMockData } from '@/lib/context';
import { ministryRegistry } from '@/lib/data';
import { stripActuals } from '@/lib/strip-actuals';
import type { MinistryData } from '@/lib/types';

export function useMinistryData(): MinistryData {
  const { id } = useParams<{ id: string }>();
  const { mockDataEnabled } = useMockData();
  return useMemo(() => {
    const data = ministryRegistry[id];
    if (!data) throw new Error(`Ministry "${id}" not found in registry`);
    return mockDataEnabled ? data : stripActuals(data);
  }, [id, mockDataEnabled]);
}

/** @deprecated Use useMinistryData instead */
export const useMofData = useMinistryData;
