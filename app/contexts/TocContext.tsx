'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

interface TocContextType {
  toc: TocItem[];
  tocHtml: string;
}

const TocContext = createContext<TocContextType>({ toc: [], tocHtml: '' });

export function TocProvider({ 
  children, 
  toc = [], 
  tocHtml = '' 
}: { 
  children: ReactNode;
  toc?: TocItem[];
  tocHtml?: string;
}) {
  return (
    <TocContext.Provider value={{ toc, tocHtml }}>
      {children}
    </TocContext.Provider>
  );
}

export function useToc() {
  return useContext(TocContext);
}
