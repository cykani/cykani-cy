import type { ReactNode } from "react";

import Image from "next/image";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="relative order-2 hidden h-full overflow-hidden rounded-3xl bg-black lg:flex">
          <Image
            src="/auth-illustration.png"
            alt=""
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
