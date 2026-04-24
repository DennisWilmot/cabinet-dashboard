'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface MockDataContextType {
  mockDataEnabled: boolean;
  toggleMockData: () => void;
}

const MockDataContext = createContext<MockDataContextType>({
  mockDataEnabled: true,
  toggleMockData: () => {},
});

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [mockDataEnabled, setMockDataEnabled] = useState(true);

  return (
    <MockDataContext.Provider
      value={{
        mockDataEnabled,
        toggleMockData: () => setMockDataEnabled(prev => !prev),
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  return useContext(MockDataContext);
}
