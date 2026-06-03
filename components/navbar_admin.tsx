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

const adminWebRoutes = [
  { href: "/dashboard/admin-web", label: "Overview" },
  { href: "/dashboard/admin-web/approvals", label: "Approvals" },
  { href: "/dashboard/admin-web/users", label: "Users" },
  { href: "/dashboard/admin-web/owners", label: "Owners" },
  { href: "/dashboard/admin-web/messages", label: "Pesan Masuk" },
  { href: "/dashboard/admin-web/settle", label: "Settle Manual" },
  { href: "/logout", label: "Logout" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard/admin-web") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavbarAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/dashboard/admin-web" className="flex items-center gap-3">
            <Image
              src="/image/Mangan_Rek_logo-Photoroom.png"
              alt="Mangan Rek Logo"
              width={150}
              height={42}
              className="h-11 w-auto"
              draggable={false}
              priority
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground">Admin Web</p>
              <p className="text-xs text-muted-foreground">Restaurant approvals</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {adminWebRoutes.map((item) => (
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
                  aria-label="Buka menu admin web"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-card">
                <SheetHeader>
                  <SheetTitle>Admin Web</SheetTitle>
                  <SheetDescription>
                    Navigasi dashboard admin web.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-2 text-sm">
                  {adminWebRoutes.map((item) => (
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
