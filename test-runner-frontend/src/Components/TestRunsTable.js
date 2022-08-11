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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

/*
const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: 'population',
    label: 'Population',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];
*/


const columns = [

    { 
        id: 'id',
        label: 'JobId',
        minWidth: 330,

    },
    {
      id: 'branch',
      label: 'Branch',
      minWidth: 150,
    },
    {
      id: 'benchmarks',
      label: 'Benchmarks',
      minWidth: 180,
    },
    {
      id: 'improvedVsRegresed',
      label: 'Improved vs Regresed',
      type: 'number',
      minWidth: 250,
    },
    {
      id: 'date',
      label: 'Date',
      description: 'This column has a value getter and is not sortable.',
      minWidth: 300,
    },
  ];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

export default function TestRunsTable({childToParentCheckBox, checkBoxState, testResults, rowsF, sortBenchmarks, sortDate}) {
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
   // setCheckBoxSelection(checkBoxSelection.filter(test => test === value));
   childToParentCheckBox(value); 
  }; 
  
  

  /*
  const handleChange = (value) => { 
    console.log(true);
   };
   */
   

  return (
    
    <Paper sx={{ width: "100%", marginTop: checkBoxState == false ? "2.5%" : "1.2%" }} elevation={12}>
      <TableContainer sx={{ maxHeight: checkBoxState == false ? "54vh" : "48vh" }} >
        <Table stickyHeader>
          <TableHead>

          

            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 3, minWidth: column.minWidth }}
                  //align= "left"
                >
                {
                  column.label === "Date" ?
                    <Stack direction="row" spacing={4}>
                        <div><b>{column.label}</b></div>
                        <IconButton color="primary" sx={{top: "13%", position: "absolute"}} onClick={() => {sortDate()}}>
                            <ArrowUpwardIcon />
                        </IconButton>
                    </Stack>
                  /*  :
                    column.label === "Benchmarks" ?
                    <Stack direction="row" spacing={11}>
                    <div><b>{column.label}</b></div>
                    <IconButton color="primary" sx={{top: "13%", position: "absolute"}} onClick={() => {sortBenchmarks()}}>
                        <ArrowUpwardIcon />
                    </IconButton>
                    </Stack>
                  */
                    :
                  <b>{column.label}</b>
                }
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          

            {rowsF
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{maxHeight: "70px", height: "70px"}}>
                     
                    
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        
                        <TableCell key={column.id} align={column.align}>
                            
                        {
                                column.id === "improvedVsRegresed" ?

                                <Stack direction="row" spacing={2}>
                                <Typography sx={{color: "green"}}>{value.improved}</Typography>
                                <ProgressBar style={{width: "57%", height: "0.9vh", marginTop:"4%"}}>
                                    <ProgressBar variant="success" now={value.improved * 100} key={1} />
                                    <ProgressBar variant="danger" now={value.regressed * 100} key={2} />
                                </ProgressBar>
                                <Typography variant="h8" sx={{color: "red"}}>{value.regressed}</Typography>
                                </Stack>
                                 :

                                  column.id !== "id" ?
                                        value 
                                    :

                                    checkBoxState == true 
                                            ?
                                                row.status === "FINISHED"
                                                 ?
                                                   <Stack direction="row" spacing={2}>
                                                    <Checkbox onChange={() => handleChange(value)}/>
                                                    <Stack direction="row" spacing={2} style={{marginTop: "1.8%"}}>                                                      
                                                        <CheckCircleOutlinedIcon sx={{color:"green"}}/>
                                                        <div>{value}</div>
                                                    </Stack>
                                                    </Stack>
                                                 :
                                                 <Stack direction="row" spacing={2}>
                                                    <Checkbox onChange={() => handleChange(value)}/>
                                                   <Stack direction="row" spacing={2} style={{marginTop: "1.8%"}}>
                                                        <HighlightOffOutlinedIcon sx={{color:"red"}}/>
                                                        <div>{value}</div>
                                                    </Stack>
                                                 </Stack>
                                            :
                                                row.status === "FINISHED"
                                                ?
                                                    <Stack direction="row" spacing={2}>
                                                        <CheckCircleOutlinedIcon sx={{color:"green"}}/>
                                                        <div>{value}</div>
                                                    </Stack>
                                                :
                                                    <Stack direction="row" spacing={2}>
                                                        <HighlightOffOutlinedIcon sx={{color:"red"}}/>
                                                        <div>{value}</div>
                                                    </Stack>
                        
                          }
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
        sx={{borderTop: "1px solid lightgray"}}
        rowsPerPageOptions={[3, 5, 10]}
        component="div"
        count={rowsF.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
