"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const adminRestoRoutes = [
  { href: "/dashboard/admin-resto", label: "Overview" },
  { href: "/dashboard/admin-resto/menu", label: "Menu" },
  { href: "/dashboard/admin-resto/promo", label: "Promo" },
  { href: "/dashboard/admin-resto/buat_kasir", label: "Buat Kasir" },
  { href: "/logout", label: "Logout" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard/admin-resto") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavbarResto({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/dashboard/admin-resto" className="flex items-center gap-3">
            <Image
              src="/image/Mangan_Rek_logo_Deep_Blue_202605302133.jpeg"
              alt="Mangan Rek Logo"
              width={150}
              height={42}
              className="h-11 w-auto"
              priority
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground">Admin Resto</p>
              <p className="text-xs text-muted-foreground">Manage menu & kasir</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {adminRestoRoutes.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActivePath(pathname, item.href) ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-border bg-card"
                  aria-label="Buka menu admin resto"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-card">
                <SheetHeader>
                  <SheetTitle>Admin Resto</SheetTitle>
                  <SheetDescription>
                    Navigasi dashboard admin resto.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-2 text-sm">
                  {adminRestoRoutes.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        isActivePath(pathname, item.href)
                          ? "rounded-lg bg-muted px-3 py-2 font-medium text-foreground"
                          : "rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}
