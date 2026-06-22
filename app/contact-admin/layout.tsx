import AdminGuard from "@/components/AdminGuard";

export default function ContactAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}