import { SignupView } from "@/components/signup-view";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const user = await getSession();

  if (user) {
    redirect('/');
  }

  return <SignupView />;
}