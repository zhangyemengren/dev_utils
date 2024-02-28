// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }) {
    return <NextUIProvider className="h-full pt-20">{children}</NextUIProvider>;
}
