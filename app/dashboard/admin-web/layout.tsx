import { NavbarAdmin } from "@/components/navbar_admin";

export default function AdminWebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NavbarAdmin>{children}</NavbarAdmin>;
}
