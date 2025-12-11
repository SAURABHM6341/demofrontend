"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 2000,
        style: {
          background: "white",
          color: "black",
          border: "1px solid #e5e7eb",
        },
      }}
      richColors
    />
  );
}
