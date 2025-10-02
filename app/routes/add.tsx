import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { dbQueries } from "../lib/db.server";
import { CATEGORIES } from "~/types/expense";
import PageWrapper from "~/components/PageWrapper";
import FormField from "~/components/FormField";


interface ActionData {
  errors?: {
    description?: string;
    amount?: string;
    category?: string;
    date?: string;
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const description = formData.get("description") as string;
  const amount = formData.get("amount") as string;
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;

  // Validation
  const errors: ActionData["errors"] = {};

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

  await dbQueries.createExpense({
    description: description.trim(),
    amount: Number(amount),
    category,
    date
  });

  return redirect("/");
}

export default function Add() {
  const actionData = useActionData<typeof action>();
  const today = new Date().toISOString().split('T')[0];

  return (
    <PageWrapper>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add New Expense</h1>
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
            placeholder="e.g., Groceries, Coffee, Gas"
            error={actionData?.errors?.description}
          />

          <FormField
            id="amount"
            name="amount"
            label="Amount (₹) *"
            type="number"
            placeholder="0.00"
            error={actionData?.errors?.amount}
          />

          <FormField
            id="category"
            name="category"
            label="Category *"
            options={CATEGORIES}
            error={actionData?.errors?.category}
          />

          <FormField
            id="date"
            name="date"
            label="Date *"
            type="date"
            defaultValue={today}
            error={actionData?.errors?.date}
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Add Expense
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
