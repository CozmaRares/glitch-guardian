"use client";

import { useState, createContext, useContext } from "react";
import { type Page } from "@/lib/data";

const ActivePageContext = createContext<{
  activePage: Page;
  setActivePage: (page: Page) => void;
} | null>(null);

type Props = { children: React.ReactNode };

export default function ActivePageProvider({ children }: Props) {
  const [activePage, setActivePage] = useState<Page>("Overview");

  return (
    <ActivePageContext.Provider
      value={{
        activePage,
        setActivePage,
      }}
    >
      {children}
    </ActivePageContext.Provider>
  );
}

export function useActivePage() {
  const context = useContext(ActivePageContext);

  if (context == null) {
    throw new Error("useActivePage must be used within an ActivePageProvider");
  }

  return context;
}
