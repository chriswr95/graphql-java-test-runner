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
  ErrorBar,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const benchmarkModes = {
  thrpt: 'Throughput',
  avgt: 'Average Time',
  sample: 'Sample Time',
  ss: 'Single Shot Time',
  all: 'All',
};

const barColors = ['#313846', '#E535AB'];

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <Paper
            style={{
              padding: '4%',
              backgroundColor: 'transparent',
              width: '100%',
              minWidth: mediumCharts ? '48vh' : '61vh',
            }}
            elevation={8}
          >
            <Paper
              style={{
                paddingLeft: '2%',
                paddingTop: '3.2%',
                paddingRight: '2%',
                paddingBottom: '0.5%',
                fontWeight: 600,
              }}
              elevation={4}
              align="center"
            >
              <p>{label}</p>
            </Paper>
            <TableContainer component={Paper} elevation={24} sx={{ marginTop: '2.5%' }}>
              <Table size="medium" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Score</TableCell>
                    <TableCell align="center">Score Error</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" align="center" sx={{ color: '#337ab7' }}>
                      {payload[0].value}
                    </TableCell>

                    <TableCell component="th" scope="row" align="center" sx={{ color: '#ff5757' }}>
                      {payload[0].payload.error}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      );
    }
  };

  return (
    <Box sx={{ width: size }}>
      <Chip sx={{ marginTop: '1%', marginBottom: '1.6%', backgroundColor: '#F1F1F1' }} label={benchmarkModes[mode]} />
      <ResponsiveContainer width="100%" height={261}>
        <BarChart data-testid="chart" data={benchmarksData} layout="vertical">
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            width={mediumCharts ? 61 : 79}
            tick={{ fontSize: 11 }}
            tickLine={true}
            tickMargin={9}
          />
          <CartesianGrid strokeDasharray="2 2" />
          <Tooltip content={<CustomTooltip data-testid="bars-tooltip" />} />
          <Bar dataKey={'score'} fill={mediumCharts ? '#337ab7' : '#313846'}>
            <ErrorBar dataKey="error" width={4} strokeWidth={2.7} stroke={mediumCharts ? '#313846' : '#ACB2B2'} />
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
