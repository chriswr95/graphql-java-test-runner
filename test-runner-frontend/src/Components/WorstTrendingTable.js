import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';


const columns = [
    { field: 'id',
      headerName: 'Benchmark',
      width: 170,
      editable: false,
      sortable: false,
    },
    {
      field: 'change',
      headerName: 'Change',
      width: 100,
      editable: true,
      sortable: false,
    },
    {
      field: 'scoreBefore',
      headerName: 'Score Before',
      width: 130,
      editable: true,
      sortable: false,
    },
    {
      field: 'scoreAfter',
      headerName: 'Score After',
      width: 130,
      editable: true,
      sortable: false,
    },
    {
      field: 'date',
      headerName: 'Data',
      description: 'This column has a value getter and is not sortable.',
      width: 120,
      sortable: true,
      editable: false,
    },
  ];
  
  const rows = [
    { id: "Benchmark-name-10", change: '-25%', scoreBefore: 100, scoreAfter: 75, date: "05/11/2022" },
    { id: "Benchmark-name-9", change: '-25%', scoreBefore: 100, scoreAfter: 75, date: "05/11/2022" },
    { id: "Benchmark-name-8", change: '-25%', scoreBefore: 100, scoreAfter: 75, date: "05/11/2022" },
    { id: "Benchmark-name-7", change: '-25%', scoreBefore: 100, scoreAfter: 75, date: "05/11/2022" },
    { id: "Benchmark-name-6", change: '-25%', scoreBefore: 100, scoreAfter: 75, date: "05/11/2022" },
    { id: "Benchmark-name-5", change: '-25%', scoreBefore: 100, scoreAfter: 75, date: "05/11/2022" },
    { id: "Benchmark-name-4", change: '-25%', scoreBefore: 100, scoreAfter: 75, date: "05/11/2022" },
    { id: "Benchmark-name-3", change: '-25%', scoreBefore: 100, scoreAfter: 75, date: "05/11/2022" },
    { id: "Benchmark-name-2", change: '-25%', scoreBefore: 100, scoreAfter: 75, date: "05/11/2022" },
    { id: "Benchmark-name-1", change: '-25%', scoreBefore: 100, scoreAfter: 75, date: "05/11/2022" },
  ];

  

export function WorstTrendingTable() {
    return(
        <div>

            <Box sx={{ height: 500, marginTop: "1.6%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    //checkboxSelection
                    disableSelectionOnClick
                    sx={{textAlign: "center"}}
                />
            </Box>
        </div>
    )
}