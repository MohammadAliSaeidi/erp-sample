"use client";

import { SocketProvider } from "@/src/interface/ui/realtime/providers/socket-provider";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

export default function InventoryRealtimeLayout({
  children,
}: PropsWithChildren) {
  const params = useParams<{ storeSlug: string }>();
  const storeSlug = params.storeSlug;

  if (!storeSlug) {
    return children;
  }

  return <SocketProvider storeSlug={storeSlug}>{children}</SocketProvider>;
}
