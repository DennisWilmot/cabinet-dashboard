'use client';

import { useMemo } from 'react';
import { useMockData } from '@/lib/context';
import { mofData } from '@/lib/mock-data';
import { stripActuals } from '@/lib/strip-actuals';
import type { MinistryData } from '@/lib/types';

export function useMofData(): MinistryData {
  const { mockDataEnabled } = useMockData();
  return useMemo(
    () => mockDataEnabled ? mofData : stripActuals(mofData),
    [mockDataEnabled]
  );
}
