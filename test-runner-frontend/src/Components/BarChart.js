import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ErrorBar } from 'recharts';

export default function BarCharts(classesAndBenchmarksState) {
  var benchmarksData = [];
  const [mode, setMode] = useState();
  const [benchmarksDataState, setBenchmarksDataState] = useState([]);

  const updateCurrentBenchmarkData = (currentClass) => {
    currentClass.map((currentBenchmark) => {
      var currentBenchmarkData = {};
      Object.entries(currentBenchmark).map(([key, value]) => {
        if (key === 'benchmarkMethod') currentBenchmarkData.name = value;
        else if (key === 'benchmarkScore') {
          currentBenchmarkData.avgt = value;
          currentBenchmarkData.thrpt = value;
          currentBenchmarkData.ss = value;
          currentBenchmarkData.sample = value;
          currentBenchmarkData.all = value;
        } else if (key === 'benchmarkError') currentBenchmarkData.error = [0, value];
        else if (key === 'mode') setMode(value);
        return currentBenchmark;
      });
      return benchmarksData.push(currentBenchmarkData);
    });
  };

  const constructbenchmarksData = () => {
    updateCurrentBenchmarkData(classesAndBenchmarksState.classesAndBenchmarksState);
    setBenchmarksDataState(benchmarksData);
    benchmarksData = [];
  };

  useEffect(() => {
    constructbenchmarksData();
    // eslint-disable-next-line
  }, []);

  const getModeName = (mode) => {
    var benchmarkModes = {
      thrpt: 'Throughput',
      avgt: 'Average Time',
      sample: 'Sample Time',
      ss: 'Single Shot Time',
      all: 'All',
    };

    return Object.entries(benchmarkModes)
      .filter(([modeAbbreviation]) => modeAbbreviation === mode)
      .map(([_, modeName]) => modeName);
  };

  return (
    <Box>
      <Chip sx={{ marginTop: '1.6%', marginBottom: '3.6%', backgroundColor: 'F1F1F1' }} label={getModeName(mode)} />
      <BarChart width={537} height={270} data={benchmarksDataState} layout="vertical">
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
