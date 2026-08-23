"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type SearchFilter = {
  location: string;
  guests: number;
} | null;

type SearchFilterContextValue = {
  filter: SearchFilter;
  applyFilter: (filter: SearchFilter) => void;
  clearFilter: () => void;
};

const SearchFilterContext = createContext<SearchFilterContextValue | null>(null);

export function SearchFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<SearchFilter>(null);
  return (
    <SearchFilterContext.Provider
      value={{ filter, applyFilter: setFilter, clearFilter: () => setFilter(null) }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
}

export function useSearchFilter() {
  const ctx = useContext(SearchFilterContext);
  if (!ctx) {
    throw new Error("useSearchFilter must be used within a SearchFilterProvider");
  }
  return ctx;
}
