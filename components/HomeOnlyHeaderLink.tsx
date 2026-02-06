"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  href: string;
  children: ReactNode;
};

export default function HomeOnlyHeaderLink({ href, children }: Props) {
  const pathname = usePathname();

  if (pathname !== "/") {
    return null;
  }

  return (
    <Button asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
