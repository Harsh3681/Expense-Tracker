import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: { category: string; amount: number }[];
  categoryColors: Record<string, string>;
}

export default function PieChart({ data, categoryColors }: PieChartProps) {
  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor: data.map(
          (d) => categoryColors[d.category] || "#9ca3af" 
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let value = context.raw as number;
            return `₹${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Pie data={chartData} options={options} />
    </div>
  );
}
