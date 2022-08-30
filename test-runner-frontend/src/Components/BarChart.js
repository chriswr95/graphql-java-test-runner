import React from 'react';
import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ErrorBar, ResponsiveContainer } from 'recharts';

const benchmarkModes = {
  thrpt: 'Throughput',
  avgt: 'Average Time',
  sample: 'Sample Time',
  ss: 'Single Shot Time',
  all: 'All',
};

export default function BarCharts(props) {
  let mode;

  var benchmarksData = props.classesAndBenchmarksState.map((currentBenchmark) => {
    var currentBenchmarkData = {
      name: currentBenchmark.benchmarkMethod,
      score: currentBenchmark.benchmarkScore,
      error: [
        currentBenchmark.benchmarkScore - currentBenchmark.json.primaryMetric.scorePercentiles['0.0'],
        currentBenchmark.json.primaryMetric.scorePercentiles['100.0'] - currentBenchmark.benchmarkScore,
      ],
    };
    mode = currentBenchmark.mode;
    return currentBenchmarkData;
  });

  return (
    <Box sx={{ width: '62vh' }}>
      <Chip sx={{ marginTop: '1.6%', marginBottom: '3.4%', backgroundColor: 'F1F1F1' }} label={benchmarkModes[mode]} />
      <ResponsiveContainer minWidth="100%" height={270}>
        <BarChart data={benchmarksData} layout="vertical">
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <CartesianGrid strokeDasharray="2 2" />
          <Tooltip />
          <Legend />
          <Bar dataKey={'score'} fill="#337ab7">
            <ErrorBar dataKey="error" width={4} strokeWidth={2} stroke="black" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
