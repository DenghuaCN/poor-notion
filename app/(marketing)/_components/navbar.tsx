"use client";

import { useConvexAuth } from "convex/react";

import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks/useScrollTop";
import { ModeToggle } from "@/components/mode-toggle";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const Navbar = () => {

  const isScrollingY = useScrollTop();
  const { isAuthenticated, isLoading } = useConvexAuth();

  const getClassNames = () => {
    const defaultClass = "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1f1f1f]";
    // 垂直滚动navbar样式变化
    if (isScrollingY) {
      return cn(`${defaultClass} border-b shadow-sm`);
    } else {
      return cn(`${defaultClass}`);
    }
  }

  return (
    <div className={getClassNames()}>
      <Logo />

      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">

        {isLoading && (
          <Spinner />
        )}

        {/* 未登录 */}
        {(!isAuthenticated && !isLoading) && (
          <>
            <SignInButton mode="modal">
              <Button variant='ghost' size='sm'>Login in</Button>
            </SignInButton>

            <SignInButton mode="modal">
              <Button size='sm'>Get Poor Notion Free</Button>
            </SignInButton>
          </>
        )}
        {(isAuthenticated && !isLoading) && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">
                Enter Poor Notion
              </Link>
            </Button>
            <UserButton
              afterSignOutUrl="/"
            />
          </>
        )}


        <ModeToggle />
      </div>
    </div>
  )
}
