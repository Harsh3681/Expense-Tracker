import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, useSearchParams, Form } from "@remix-run/react";
import { dbQueries } from "../lib/db.server";
import { CATEGORIES } from "~/types/expense";
import PieChart from "~/components/PieChart";
import ExpenseTable from "~/components/ExpenseTable";


export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || undefined;
  const startDate = url.searchParams.get("startDate") || undefined;
  const endDate = url.searchParams.get("endDate") || undefined;

  const expenses = await dbQueries.getExpenses({ category, startDate, endDate });

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate category totals for chart
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return json({ expenses, total, categoryTotals });
}

export default function Index() {
  const { expenses, total, categoryTotals } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const categoryColors: Record<string, string> = {
    Food: "#ef4444",
    Transport: "#3b82f6",
    Entertainment: "#8b5cf6",
    Bills: "#f59e0b",
    Healthcare: "#10b981",
    Shopping: "#ec4899",
    Other: "#6b7280",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">💰 Expense Tracker</h1>
            <Link
              to="/add"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Expense
            </Link>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4">
            <p className="text-sm opacity-90">Total Expenses</p>
            <p className="text-4xl font-bold">₹{total.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <Form method="get" className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                defaultValue={searchParams.get("category") || "all"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                defaultValue={searchParams.get("startDate") || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                defaultValue={searchParams.get("endDate") || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Apply
              </button>
              <Link
                to="/"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear
              </Link>
            </div>
          </Form>
        </div>

{/* We did her --> Bar + Pie Charts */}
        {Object.keys(categoryTotals).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Bar representation */}
              <div className="flex-1">
                {Object.entries(categoryTotals).map(([category, amount]) => {
                  const percentage = ((amount / total) * 100).toFixed(1);
                  return (
                    <div key={category} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm text-gray-600">
                          ₹{amount} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: categoryColors[category],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex-1"> {/* Pie chart representation */}
                <PieChart
                  data={Object.entries(categoryTotals).map(([category, amount]) => ({
                    category,
                    amount,
                  }))}
                  categoryColors={categoryColors}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden"> {/* Expenses Table */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">All Expenses</h2>
          </div>
          <ExpenseTable expenses={expenses} categoryColors={categoryColors} />
        </div>

      </div>
    </div>
  );
}
