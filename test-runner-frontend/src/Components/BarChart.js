
import React, { useEffect, useState } from "react";
import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';
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

  //console.log(classesAndBenchmarksState);

  const [mode, setMode] = useState();
  const [benchmarksDataState, setBenchmarksDataState] = useState([]);
  
  const updateCurrentBenchmarkData = (currentClass) => {
    for(var i=0; i<currentClass.length; i++){
    var currentBenchmarkData = {};
      for (const [key, value] of Object.entries(currentClass[i])) {
        if(key === "benchmarkMethod")
          currentBenchmarkData.name = value
        else if(key === "benchmarkScore"){
          currentBenchmarkData.avgt = value
          currentBenchmarkData.thrpt = value
          currentBenchmarkData.ss = value
          currentBenchmarkData.sample = value
          currentBenchmarkData.all = value
        }
        else if(key === "benchmarkError")
          currentBenchmarkData.error =[0, value]
        else if(key === "mode")
          setMode(value);
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
    <Box>
    <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label={mode} />
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
      <Bar dataKey={mode} fill="#337ab7">
        <ErrorBar dataKey="error" width={4} strokeWidth={2} stroke="black" />
        <ErrorBar dataKey="errorNegative" width={4} strokeWidth={2} stroke="red" />
      </Bar>
    </BarChart>
    </Box>
  );
}