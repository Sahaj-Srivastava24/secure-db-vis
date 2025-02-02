import { LoginView } from "@/components/login-view";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getSession();

  if (user) {
    redirect('/');
  }

  return <LoginView />;
}