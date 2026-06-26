import { redirect } from "next/navigation";
import { auth } from "@/auth";
import MyAccountTabs from "@/components/account/MyAccountTabs";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <div className="w-full">
      <MyAccountTabs role={session.user.role} />
    </div>
  );
}
