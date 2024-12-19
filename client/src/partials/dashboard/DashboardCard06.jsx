import React from "react";
import DoughnutChart from "../../charts/DoughnutChart";

// Import utilities
import { tailwindConfig } from "../../utils/Utils";

function DashboardCard06() {
  const chartData = {
    labels: ["Good", "Neutral", "Bad"],
    datasets: [
      {
        label: "Reviews",
        data: [75, 20, 5],
        backgroundColor: [
          tailwindConfig().theme.colors.sky[300],
          tailwindConfig().theme.colors.violet[200],
          tailwindConfig().theme.colors.red[200],
        ],
        hoverBackgroundColor: [
          tailwindConfig().theme.colors.sky[400],
          tailwindConfig().theme.colors.violet[300],
          tailwindConfig().theme.colors.red[300],
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Reviews
        </h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  );
}

export default DashboardCard06;
