import { NavbarResto } from "@/components/navbar_resto";

export default function AdminRestoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NavbarResto>{children}</NavbarResto>;
}
