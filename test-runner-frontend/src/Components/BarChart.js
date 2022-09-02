import React from 'react';
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
  ErrorBar,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const benchmarkModes = {
  thrpt: 'Throughput',
  avgt: 'Average Time',
  sample: 'Sample Time',
  ss: 'Single Shot Time',
  all: 'All',
};

const barColors = ['#337ab7', '#ff7f0e'];

export default function BarCharts({ classesAndBenchmarksState, mediumCharts }) {
  let mode;
  let size = mediumCharts ? '62vh' : '138vh';

  const benchmarksData = classesAndBenchmarksState?.map((currentBenchmark) => {
    const currentBenchmarkData = {
      name: currentBenchmark.benchmarkMethod,
      score: currentBenchmark.benchmarkScore,
      error: currentBenchmark.json?.primaryMetric.scoreError,
    };
    mode = currentBenchmark.mode;
    return currentBenchmarkData;
  });

  return (
    <Box sx={{ width: size }}>
      <Chip sx={{ marginTop: '1.6%', marginBottom: '2.1%', backgroundColor: 'F1F1F1' }} label={benchmarkModes[mode]} />
      <ResponsiveContainer minWidth="100%" height={270}>
        <BarChart data-testid="chart" data={benchmarksData} layout="vertical">
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <CartesianGrid strokeDasharray="2 2" />
          <Tooltip />
          <Legend />
          <Bar dataKey={'score'} fill="#337ab7">
            <ErrorBar dataKey="error" width={4} strokeWidth={2} stroke="black" />
            {!mediumCharts
              ? classesAndBenchmarksState?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % 2]} />
                ))
              : null}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
