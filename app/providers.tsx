"use client";

import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

// Providers simplifié - pas d'authentification nécessaire
export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
