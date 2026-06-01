"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { ROLE_COOKIE_NAME, normalizeRole } from "@/lib/auth";

const publicRoutes = new Set([
  "/",
  "/restaurants",
  "/rencana-perjalanan",
  "/favorit",
  "/promo",
  "/profile",
]);

function isPublicRoute(pathname: string) {
  return publicRoutes.has(pathname);
}

function readCookieValue(cookieName: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${cookieName}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function getInitials(role: string | null) {
  if (!role) return "MR";

  return role
    .split("-")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

export function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSharedChrome = isPublicRoute(pathname);
  const [role] = useState<string | null>(() => normalizeRole(readCookieValue(ROLE_COOKIE_NAME)));

  if (!showSharedChrome) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:py-1">
          <div className="flex items-center gap-3">
            <Image
              src="/image/Mangan_Rek_logo_Deep_Blue_202605302133.jpeg"
              alt="Mangan Rek Logo"
              width={160}
              height={44}
              className="h-12 w-auto sm:h-14 md:h-16"
              priority
            />
          </div>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/" className="font-medium text-foreground">
              Jelajahi
            </Link>
            <Link href="/restaurants" className="hover:text-foreground">
              Restoran
            </Link>
            <Link href="/rencana-perjalanan" className="hover:text-foreground">
              Rencana perjalanan
            </Link>
            <Link href="/promo" className="hover:text-foreground">
              Promo
            </Link>
            <Link href="/favorit" className="hover:text-foreground">
              Favorit
            </Link>
            {role ? (
              <Link href="/profile" className="hover:text-foreground">
                Profil
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              {role ? (
                <Link href="/profile" aria-label="Buka profil">
                  <Avatar className="h-10 w-10 border border-border bg-primary/10 text-primary">
                    <AvatarFallback className="bg-transparent text-sm font-semibold text-primary">
                      {getInitials(role)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Login
                  </Button>
                </Link>
              )}
            </div>

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 border-border bg-card"
                    aria-label="Buka menu"
                  >
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-card">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navigasi utama aplikasi Mangan Rek.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 flex flex-col gap-2 text-sm">
                    <Link href="/" className="rounded-lg px-3 py-2 font-medium text-foreground hover:bg-muted">
                      Jelajahi
                    </Link>
                    <Link href="/restaurants" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                      Restoran
                    </Link>
                    <Link href="/rencana-perjalanan" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                      Rencana perjalanan
                    </Link>
                    <Link href="/favorit" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                      Favorit
                    </Link>
                    <Link href="/promo" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                      Promo
                    </Link>
                    {role ? (
                      <Link href="/profile" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                        Profil
                      </Link>
                    ) : null}
                  </div>

                  <div className="mt-6 border-t border-border pt-4">
                    {role ? (
                      <Link href="/profile" className="flex items-center gap-3 rounded-xl border border-border px-3 py-3">
                        <Avatar className="h-10 w-10 border border-border bg-primary/10 text-primary">
                          <AvatarFallback className="bg-transparent text-sm font-semibold text-primary">
                            {getInitials(role)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="text-sm font-semibold text-foreground">
                            Buka Profil
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {role}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link href="/login">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 text-xs text-muted-foreground md:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/image/Mangan_Rek_logo_Deep_Blue_202605302133.jpeg"
              alt="Mangan Rek Logo"
              width={130}
              height={36}
              className="h-10 w-auto"
            />
            <span>© 2026 Mangan Rek! Malang Culinary Heritage.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="#">About Us</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Local Guides</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}