import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useActionData } from "@remix-run/react";
import { dbQueries } from "../lib/db.server";
import { CATEGORIES } from "~/types/expense";
import PageWrapper from "~/components/PageWrapper";
import FormField from "~/components/FormField";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  const expense = await dbQueries.getExpense(id);

  if (!expense) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ expense });
}

interface ActionData {
  errors?: {
    description?: string;
    amount?: string;
    category?: string;
    date?: string;
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const id = Number(params.id);
  const formData = await request.formData();
  const description = formData.get("description") as string;
  const amount = formData.get("amount") as string;
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
 
  const errors: ActionData["errors"] = {}; // here we did Validation

  if (!description || description.trim().length === 0) {
    errors.description = "Description is required";
  }

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.amount = "Amount must be a positive number";
  }

  if (!category || !CATEGORIES.includes(category as any)) {
    errors.category = "Please select a valid category";
  }

  if (!date) {
    errors.date = "Date is required";
  }

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  await dbQueries.updateExpense(id, {
    description: description.trim(),
    amount: Number(amount),
    category,
    date
  });

  return redirect("/");
}

export default function Edit() {
  const { expense } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Expense</h1>
        <Link
          to="/"
          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          ← Back to List
        </Link>
      </div>

      <Form method="post" className="space-y-6">
        {/* Description */}
        <FormField
          id="description"
          name="description"
          label="Description *"
          defaultValue={expense.description}
          error={actionData?.errors?.description}
        />

        <FormField
          id="amount"
          name="amount"
          label="Amount (₹) *"
          type="number"
          defaultValue={expense.amount}
          error={actionData?.errors?.amount}
        />

        <FormField
          id="category"
          name="category"
          label="Category *"
          defaultValue={expense.category}
          options={CATEGORIES}
          error={actionData?.errors?.category}
        />

        <FormField
          id="date"
          name="date"
          label="Date *"
          type="date"
          defaultValue={expense.date}
          error={actionData?.errors?.date}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Update Expense
          </button>
          <Link
            to="/"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </PageWrapper>

  );
}