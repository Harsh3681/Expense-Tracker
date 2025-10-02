import { Link, Form } from "@remix-run/react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface Props {
  expenses: Expense[];
  categoryColors: Record<string, string>;
}

export default function ExpenseTable({ expenses, categoryColors }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p className="text-lg">No expenses found</p>
        <p className="text-sm mt-2">Start by adding your first expense!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(expense.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className="px-3 py-1 text-xs font-medium rounded-full text-white"
                  style={{ backgroundColor: categoryColors[expense.category] }}
                >
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                ₹{expense.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link to={`/edit/${expense.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                  Edit
                </Link>
                <Form method="post" action={`/delete/${expense.id}`} className="inline">
                  <button
                    type="submit"
                    onClick={(e) => {
                      if (!confirm("Are you sure you want to delete this expense?")) {
                        e.preventDefault();
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
