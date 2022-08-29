import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ErrorBar, ResponsiveContainer } from 'recharts';

export default function BarCharts(props) {
  var benchmarksData = [];
  const [mode, setMode] = useState();
  const [benchmarksDataState, setBenchmarksDataState] = useState([]);

  const benchmarkModes = {
    thrpt: 'Throughput',
    avgt: 'Average Time',
    sample: 'Sample Time',
    ss: 'Single Shot Time',
    all: 'All',
  };

  const updateCurrentBenchmarkData = (currentClass) => {
    currentClass.forEach((currentBenchmark) => {
      var currentBenchmarkData = {
        name: null,
        avgt: null,
        thrpt: null,
        ss: null,
        sample: null,
        all: null,
        error: null,
      };
      Object.entries(currentBenchmark).forEach(([key, value]) => {
        if (key === 'benchmarkMethod') currentBenchmarkData.name = value;
        else if (key === 'benchmarkScore') currentBenchmarkData[currentBenchmark.mode] = value;
        else if (key === 'benchmarkError') currentBenchmarkData.error = [0, value];
        else if (key === 'mode') setMode(value);
      });
      benchmarksData.push(currentBenchmarkData);
    });
  };

  const constructBenchmarksData = () => {
    updateCurrentBenchmarkData(props.classesAndBenchmarksState);
    setBenchmarksDataState(benchmarksData);
    benchmarksData = [];
  };

  useEffect(() => {
    constructBenchmarksData();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ width: '62vh' }}>
      <Chip sx={{ marginTop: '1.6%', marginBottom: '3.4%', backgroundColor: 'F1F1F1' }} label={benchmarkModes[mode]} />
      <ResponsiveContainer minWidth="100%" height={270}>
        <BarChart data={benchmarksDataState} layout="vertical">
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
      </ResponsiveContainer>
    </Box>
  );
}
