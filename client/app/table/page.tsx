import { TableView } from "@/components/table-view";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TablePage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const user = await getSession();

  if (!user) {
    redirect('/login');
  }

  if (!searchParams.query) {
    redirect('/');
  }

  return <TableView initialQuery={decodeURIComponent(searchParams.query)} />;
}