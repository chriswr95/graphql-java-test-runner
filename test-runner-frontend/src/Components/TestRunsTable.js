import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Checkbox from '@mui/material/Checkbox';
import { IconButton, Stack, Typography } from '@mui/material';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const columns = [
  {
    id: 'id',
    label: 'JobId',
    minWidth: 350,

  },
  {
    id: 'improvedVsRegressed',
    label: 'Improved vs Regressed',
    type: 'number',
    minWidth: 270,
  },
  {
    id: 'benchmarks',
    label: 'Benchmarks',
    minWidth: 160,
  },
  {
    id: 'branch',
    label: 'Branch',
    minWidth: 170,
  },
  {
    id: 'machine',
    label: 'Machine',
    minWidth: 160,
  },
  {
    id: 'date',
    label: 'Date',
    description: 'This column has a value getter and is not sortable.',
    minWidth: 210,
  },
];

export default function TestRunsTable({ updateSelectedTestRunsToCompare, isCheckBoxActive, testRunResults, sortDate }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (value) => {
    updateSelectedTestRunsToCompare(value);
  };

  return (

    <Paper sx={{ width: "100%", marginTop: isCheckBoxActive === false ? "1.6%" : "0.7%" }} elevation={12}>
      <TableContainer sx={{ maxHeight: isCheckBoxActive === false ? "55vh" : "49vh" }} >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                let cell = null;

                if (column.label === "Date") {
                  cell = <Stack direction="row" spacing={4}>
                    <div><b>{column.label}</b></div>
                    <IconButton sx={{ top: "13%", position: "absolute" }} onClick={() => { sortDate() }}>
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Stack>
                } else {
                  cell = <b>{column.label}</b>
                }
                return (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ top: 3, minWidth: column.minWidth }}
                  >
                    {cell}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>


            {testRunResults
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{ maxHeight: "70px", height: "70px" }}>


                    {columns.map((column) => {
                      const value = row[column.id];
                      let cell = null;

                      if (column.id === "improvedVsRegressed") {
                        cell = <Stack direction="row" spacing={2}>
                          <Typography sx={{ color: "green" }}>{value.improved}</Typography>
                          <ProgressBar style={{ width: "57%", height: "0.9vh", marginTop: "4%" }}>
                            <ProgressBar variant="success" now={value.improved * 100} key={1} />
                            <ProgressBar variant="danger" now={value.regressed * 100} key={2} />
                          </ProgressBar>
                          <Typography variant="h8" sx={{ color: "red" }}>{value.regressed}</Typography>
                        </Stack>
                      } else if (column.id !== "id") {
                        cell = value
                      } else {
                        if (isCheckBoxActive === true) {
                          if (row.status === "FINISHED") {
                            cell = <Stack direction="row" spacing={2}>
                              <Checkbox onChange={() => handleChange(value)} />
                              <Stack direction="row" spacing={2} style={{ marginTop: "1.8%" }}>
                                <CheckCircleOutlinedIcon sx={{ color: "green" }} />
                                <div>{value}</div>
                              </Stack>
                            </Stack>
                          } else {
                            cell = <Stack direction="row" spacing={2}>
                              <Checkbox onChange={() => handleChange(value)} />
                              <Stack direction="row" spacing={2} style={{ marginTop: "1.8%" }}>
                                <HighlightOffOutlinedIcon sx={{ color: "red" }} />
                                <div>{value}</div>
                              </Stack>
                            </Stack>
                          }
                        } else {
                          if (row.status === "FINISHED") {
                            cell = <Stack direction="row" spacing={2}>
                              <CheckCircleOutlinedIcon sx={{ color: "green" }} />
                              <div>{value}</div>
                            </Stack>
                          } else {
                            cell = <Stack direction="row" spacing={2}>
                              <HighlightOffOutlinedIcon sx={{ color: "red" }} />
                              <div>{value}</div>
                            </Stack>
                          }
                        }
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {cell}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ borderTop: "1px solid lightgray" }}
        rowsPerPageOptions={[3, 5, 10]}
        component="div"
        count={testRunResults.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}