import React, { useEffect, useState } from "react";
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

export default function BarCharts(classesAndBenchmarksState) {
  var benchmarksData = [];

  console.log(classesAndBenchmarksState)
  console.log(classesAndBenchmarksState.classesAndBenchmarksState)

  const [benchmarksDataState, setBenchmarksDataState] = useState([]);
  
  const updateCurrentBenchmarkData = (currentClass) => {
    for(var i=0; i<currentClass.length; i++){
    var currentBenchmarkData = {};
      for (const [key, value] of Object.entries(currentClass[i])) {
        if(key === "benchmarkMethod")
          currentBenchmarkData.name = value
        else if(key === "benchmarkScore")
          currentBenchmarkData.Throughput_Ops = value
        else if(key === "benchmarkError")
          currentBenchmarkData.error =[0, value]
      }
      benchmarksData.push(currentBenchmarkData)
    }
  }
  
  const constructbenchmarksData = () => {
    updateCurrentBenchmarkData(classesAndBenchmarksState.classesAndBenchmarksState)
    setBenchmarksDataState(benchmarksData);
    benchmarksData = [];
  }

  useEffect(() => {
    constructbenchmarksData();
  }, [])

  return (
    <BarChart
      width={520}
      height={300}
      data={benchmarksDataState}
      layout="vertical"
    >
      <XAxis type="number" />
      <YAxis type="category" dataKey="name" />
      <CartesianGrid strokeDasharray="2 2" />
      <Tooltip />
      <Legend />
      <Bar dataKey="Throughput_Ops" fill="#337ab7">
        <ErrorBar dataKey="error" width={4} strokeWidth={2} stroke="black" />
        <ErrorBar dataKey="errorNegative" width={4} strokeWidth={2} stroke="red" />
      </Bar>
    </BarChart>
  );
}