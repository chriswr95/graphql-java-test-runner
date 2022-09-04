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

const barColors = ['black', '#E535AB'];

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

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    console.log(payload[0]);
    if (active) {
      return (
        <div className="custom-tooltip">
          <Paper style={{padding: '4%', backgroundColor: 'transparent', width: '100%', minWidth: mediumCharts ? '48vh' : '57vh' }}elevation={8}>
          <Paper style={{paddingLeft: '2%', paddingTop: '2%', paddingRight: '1%', paddingBottom: '0.5%', fontWeight: 500}} elevation={4}><p>{label}</p></Paper>
      <TableContainer component={Paper} elevation={24} sx={{marginTop: '2.5%'}}>
      <Table size="medium" aria-label="a dense table">
        <TableHead>
          <TableRow >
            <TableCell align="center">Score</TableCell>
            <TableCell align="center">Score Error</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow >
              <TableCell component="th" scope="row" align="center" sx={{color: 'blue'}}>
              {payload[0].value}
              </TableCell>

              <TableCell component="th" scope="row" align="center" sx={{color: 'red'}}>
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
  }
  

  return (
    <Box sx={{ width: size }}>
      <Chip sx={{ marginTop: '1%', marginBottom: '1.6%', backgroundColor: '#F1F1F1' }} label={benchmarkModes[mode]} />
      <ResponsiveContainer width="100%" height={277}>
        <BarChart data-testid="chart" data={benchmarksData} layout="vertical">
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <CartesianGrid strokeDasharray="2 2" />
          <Tooltip content={<CustomTooltip />}/>
          <Legend />
          <Bar dataKey={'score'} fill= {mediumCharts ? "#337ab7" : "black"}>
            <ErrorBar dataKey="error" width={4} strokeWidth={2.7} stroke={mediumCharts ? 'black' : "#ACB2B2"} />
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
