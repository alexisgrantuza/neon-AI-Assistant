import React from "react";

import Image01 from "../../images/user-36-05.jpg";
import Image02 from "../../images/user-36-06.jpg";
import Image03 from "../../images/user-36-07.jpg";
import Image04 from "../../images/user-36-08.jpg";
import Image05 from "../../images/user-36-09.jpg";

function DashboardCard10() {
  const customers = [
    {
      id: "0",
      image: Image01,
      name: "Alex Shatov",
      email: "123123123",
      noQuestions: "2",
      feedback: "Good",
    },
    {
      id: "1",
      image: Image02,
      name: "Philip Harbach",
      email: "123123123",
      noQuestions: "5",
      feedback: "Good",
    },
    {
      id: "2",
      image: Image03,
      name: "Mirko Fisuk",
      email: "123123123",
      noQuestions: "2",
      feedback: "Neutral",
    },
    {
      id: "3",
      image: Image04,
      name: "Olga Semklo",
      email: "123123123",
      noQuestions: "3",
      feedback: "Good",
    },
    {
      id: "4",
      image: Image05,
      name: "Burak Long",
      email: "123123123",
      noQuestions: "1",
      feedback: "Neutral",
    },
  ];

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Users
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">ID</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">
                    no. of Questions
                  </div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Feedback</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {customers.map((customer) => {
                return (
                  <tr key={customer.id}>
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                          <img
                            className="rounded-full"
                            src={customer.image}
                            width="40"
                            height="40"
                            alt={customer.name}
                          />
                        </div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          {customer.name}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center">{customer.email}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center font-medium text-gray-800 dark:text-gray-100">
                        {customer.noQuestions}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div
                        className={`text-lg text-center font-medium ${
                          customer.feedback === "Good"
                            ? "text-sky-300"
                            : customer.feedback === "Neutral"
                            ? "text-violet-300"
                            : "text-red-300"
                        }`}
                      >
                        {customer.feedback}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard10;
