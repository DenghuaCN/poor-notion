"use client";

import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { useScrollTop } from "@/hooks/useScrollTop";
import { ModeToggle } from "@/components/mode-toggle";

export const Navbar = () => {

  const scrollingY = useScrollTop();

  const getClassNames = () => {
    const defaultClass = "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1f1f1f]";

    if (scrollingY) {
      return cn(`${defaultClass} border-b shadow-sm`);
    } else {
      return cn(`${defaultClass}`);
    }
  }

  return (
    <div className={getClassNames()}>
      <Logo />

      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        <ModeToggle />
      </div>
    </div>
  )
}
