import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Server-side gate for every /admin/* route. Client components under this
// tree can assume an ADMIN session, but server actions still re-check.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (session.user.role !== "ADMIN") redirect("/");

  return <div className="w-full">{children}</div>;
}
