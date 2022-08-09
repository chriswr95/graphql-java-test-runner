import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ErrorBar
} from "recharts";

const data = [
  { name: "arrLst", Throughput_Ops: 4000, pv: 2400, amt: 2400, error: [100,200] },
  { name: "arrLst", Throughput_Ops: 3000, pv: 1398, amt: 2210, error: [1100,1300] },
  { name: "arrLst", Throughput_Ops: 2000, pv: 9800, amt: 2290, error: [1000,1100] },
  { name: "arrLst", Throughput_Ops: 2780, pv: 3908, amt: 2000, error: [200,210] },
  { name: "arrLst", Throughput_Ops: 1600, pv: 3908, amt: 2000, error: [170,210] }
];

export default function BarCharts() {
  return (
    <BarChart 
  width={520} 
  height={300} 
  data={data} 
  layout="vertical"
>
  <XAxis type="number"/>
  <YAxis type="category" dataKey="name" />
  <CartesianGrid strokeDasharray="2 2"/>
  <Tooltip/>
  <Legend />
  <Bar dataKey="Throughput_Ops" fill="#337ab7">
      <ErrorBar  dataKey="error" width={4} strokeWidth={2} stroke="black" />
      <ErrorBar dataKey="errorNegative" width={4} strokeWidth={2} stroke="red" />
  </Bar>
</BarChart>
  );
}