import React from "react";
import AdminHeader from "../components/AdminHeader";
import Sidebar from "../components/Sidebar";
import { generateMockData, RechartsDevtools } from "@recharts/devtools";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  PieChart,
} from "recharts";

function Dashboard() {
  const data = generateMockData(6, 823);

  const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
  const data02 = [
    { name: "A1", value: 100 },
    { name: "A2", value: 300 },
    { name: "B1", value: 100 },
    { name: "B2", value: 80 },
    { name: "B3", value: 40 },
    { name: "B4", value: 30 },
    { name: "B5", value: 50 },
    { name: "C1", value: 100 },
    { name: "C2", value: 200 },
    { name: "D1", value: 150 },
    { name: "D2", value: 50 },
  ];

  return (
    <div>
      <AdminHeader />
      <div className="md:grid md:grid-cols-6 items-stretch">
        <div className="col-span-1">
          <Sidebar></Sidebar>
        </div>
        <div className="col-span-5">
          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex items-center gap-4 rounded-lg bg-[#182878] p-6 text-white shadow-md">
              <span className="text-3xl" aria-hidden="true">
                📚
              </span>
              <div>
                <h2 className="text-sm">Total Number of Books</h2>
                <p className="text-2xl font-bold">100+</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-[#32833b] p-6 text-white shadow-md">
              <span className="text-3xl" aria-hidden="true">
                👥
              </span>
              <div>
                <h2 className="text-sm">Total Number of Users</h2>
                <p className="text-2xl font-bold">100+</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-[#b8c20b] p-6 text-white shadow-md">
              <span className="text-3xl" aria-hidden="true">
                🧑‍💼
              </span>
              <div>
                <h2 className="text-sm">Total Number of Employees</h2>
                <p className="text-2xl font-bold">100+</p>
              </div>
            </div>
          </div>
          {/* grid char */}
          <div className="md:grid grid-cols-2 p-5 mt-10">
            <div className="font-bold">
              {/* BOOK PURCHASE Ratio barchart */}
              <ResponsiveContainer width={"100%"} height={"300"}>
                <BarChart
                  responsive
                  data={data}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid />
                  <XAxis dataKey="label" />
                  <YAxis width="auto" />
                  <Tooltip />
                  <Legend />
                  <Bar fill="green" dataKey="x" radius={[10, 10, 0, 0]} />
                  <Bar fill="blue" dataKey="y" radius={[10, 10, 0, 0]} />
                  <RechartsDevtools />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="font-bold">
              {/* Growth Ratio(Yearly) pie chart */}
              <ResponsiveContainer width={"100%"} height={"300"}>
                <PieChart responsive>
                  <Pie
                    data={data01}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius="50%"
                    fill="#8884d8"
                    stroke="white"
                  />
                  <Pie
                    data={data02}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    fill="#82ca9d"
                    stroke="white"
                    label
                  />
                  <Tooltip />
                  <RechartsDevtools />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
