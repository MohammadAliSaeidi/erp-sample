import { PropsWithChildren } from "react";

export default function AdminDashboardContentLayout({
  children,
}: PropsWithChildren) {
  return (
    <div className="flex flex-col w-full h-full max-h-full overflow-y-auto overflow-x-hidden gap-4">
      {children}
    </div>
  );
}
