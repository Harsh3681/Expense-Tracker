import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { dbQueries } from "../lib/db.server";

export async function action({ params }: ActionFunctionArgs) {
  const id = Number(params.id);
  await dbQueries.deleteExpense(id);
  return redirect("/");
}