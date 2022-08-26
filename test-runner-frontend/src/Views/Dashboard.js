import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
//import Button from '@mui/material/Button';
import GraphQL_Logo from '../Assets/GraphQL_Java_Logo_v2.png';
import Alert from '@mui/material/Alert';
import { useEffect, useReducer } from 'react';
import { onSnapshot, collection } from '@firebase/firestore';
import db from './firebase';
import TestRunsTable from '../Components/TestRunsTable';
//import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import { getMachineNames, sortTestRunsByMachine, getBenchmarksByMachine, getAllBenchmarks } from './DashboardUtils';
import { Link } from 'react-router-dom';

const FIRESTORE_COLLECTION_NAME = 'test-runs';
const GRAPHQL_JAVA_GITHUB = 'https://github.com/graphql-java/graphql-java';

const initialState = {
  isCheckBoxActive: false,
  //cancelButtonState: false,
  // The original data from Firebase
  testResults: [],
  // Whether we are loading the original data
  loadingState: true,
  // The test run results displayed on screen
  testRunResults: [],
  // All unfiltered test run results
  testRunResultsCopy: [],
  // The current branch selection
  testRunSelection: '*',
  // The current machine selection
  machineSelection: '*',
  checkBoxSelection: [],
  machineNames: [],
};

const reducer = (state, action) => {
  let filteredResults;
  switch (action.type) {
    case 'saveFirestore':
      const machines = getMachineNames(action.payload);
      const sortedTestRuns = sortTestRunsByMachine(machines, action.payload);
      const benchmarksByMachine = getBenchmarksByMachine(sortedTestRuns);
      const testRunResults = getAllBenchmarks(benchmarksByMachine);

      return {
        ...state,
        testResults: action.payload,
        testRunResults,
        testRunResultsCopy: testRunResults,
        loadingState: false,
        machineNames: machines,
      };
    case 'isCheckBoxActive':
      return { ...state, isCheckBoxActive: action.payload };
    case 'filterBranch':
      const newBranch = action.payload;
      filteredResults = state.testRunResultsCopy
        .filter((test) => {
          return newBranch === '*' || test.branch === newBranch;
        })
        .filter((test) => test.machine === state.machineSelection || state.machineSelection === '*');
      return {
        ...state,
        testRunResults: filteredResults,
        testRunSelection: action.payload,
      };
    case 'filterMachine':
      const newMachineSelection = action.payload;
      filteredResults = state.testRunResultsCopy
        .filter((test) => test.branch === state.testRunSelection || state.testRunSelection === '*')
        .filter((test) => {
          return newMachineSelection === '*' || test.machine === newMachineSelection;
        });
      return {
        ...state,
        testRunResults: filteredResults,
        machineSelection: action.payload,
      };
    case 'checkBoxSelection':
      return { ...state, checkBoxSelection: action.payload };
    case 'compare':
      return {
        ...state,
        testRunResultsCopy: action.payload,
        testRunResults: action.payload,
        loadingState: action.payload,
      };
    case 'sortResults':
      const sortingMode = action.payload.key;
      const sortingBy = action.payload.sortBy;
      if (sortingBy === 'ascending') {
        return {
          ...state,
          testRunResults: [].concat(state.testRunResultsCopy).sort((a, b) => a[sortingMode] - b[sortingMode]),
        };
      } else if (sortingBy === 'decreasing') {
        return {
          ...state,
          testRunResults: [].concat(state.testRunResultsCopy).sort((a, b) => b[sortingMode] - a[sortingMode]),
        };
      }
    // eslint-disable-next-line
    default:
      return state;
  }
};

export default function Dashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    isCheckBoxActive,
    //cancelButtonState,
    loadingState,
    testRunResults,
    testRunSelection,
    machineSelection,
    checkBoxSelection,
    machineNames,
  } = state;

  //const navigate = useNavigate();

  /*
    function manageCompareAction() {
      if (checkBoxSelection.length >= 2) {
        dispatch({ type: "checkBoxSelection", payload: [] })
        //navigate("/report")
      }
      dispatch({ type: "checkBoxSelection", payload: [] })
      dispatch({ type: "isCheckBoxActive", payload: !isCheckBoxActive })
      dispatch({ type: "cancelButtonState", payload: !cancelButtonState })
    }

    const handleCancel = () => {
      dispatch({ type: "checkBoxSelection", payload: [] })
      dispatch({ type: "isCheckBoxActive", payload: false })
      dispatch({ type: "cancelButtonState", payload: false })
    }
    */

  useEffect(() => {
    onSnapshot(collection(db, FIRESTORE_COLLECTION_NAME), (snapshot) =>
      dispatch({ type: 'saveFirestore', payload: snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) })
    );
  }, []);

  const handleChangeTestRunSelection = (event) => {
    dispatch({ type: 'filterBranch', payload: event.target.value });
  };

  const handleChangeMachineSelection = (event) => {
    dispatch({ type: 'filterMachine', payload: event.target.value });
  };

  function sortTests(key, descending) {
    dispatch({ type: 'sortResults', payload: { key: key, sortBy: descending } });
  }

  const onCheckboxChange = (childToParentData) => {
    if (checkBoxSelection.find((checkBoxSelection) => checkBoxSelection === childToParentData))
      dispatch({
        type: 'checkBoxSelection',
        payload: checkBoxSelection.filter((checkBoxSelection) => checkBoxSelection !== childToParentData),
      });
    else
      dispatch({
        type: 'checkBoxSelection',
        payload: (checkBoxSelection) => [...checkBoxSelection, childToParentData],
      });
    dispatch({ type: 'isCheckBoxActive', payload: false });
  };

  return (
    <div>
      {loadingState === true ? (
        <CircularProgress
          color="secondary"
          sx={{
            position: 'absolute',
            top: '45%',
            left: '50%',
          }}
        />
      ) : (
        <div>
          <img
            style={{
              marginLeft: '2%',
              marginTop: '0.5%',
              marginBottom: '0.7%',
              width: '18%',
            }}
            src={GraphQL_Logo}
            alt="GraphQL Java Logo"
          />

          <a
            style={{
              marginRight: '3.5%',
              marginTop: '1.1%',
              float: 'right',
              color: '#e535ab',
              textDecoration: 'none',
              color: 'gray',
              fontWeight: '720',
            }}
            href={GRAPHQL_JAVA_GITHUB}
          >
            GitHub
          </a>

          <Typography sx={{ marginLeft: '2%', marginBottom: '0.4%' }} variant="h4">
            <b>Summary</b>
          </Typography>
          <br></br>

          <Stack sx={{ marginBottom: '2%' }} direction="row" spacing={9}>
            <Box
              sx={{
                width: '100%',
                marginLeft: '2%',
                marginRight: '2%',
              }}
            >
              <Stack direction="row">
                <Typography variant="h5">
                  <b>Test Run</b>
                </Typography>
                {/*
         
            {
              cancelButtonState
                ?
                <Button sx={{
                  color: "gray",
                  borderColor: "gray",
                  borderRadius: "9%",
                  position: "absolute",
                  right: "10.2%",
                  size: "small"
                }}
                  variant="outlined"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </Button>
                :
                null
            }
            <Button sx={{
              color: !isCheckBoxActive ? "gray" : "#e535ab",
              borderColor: !isCheckBoxActive ? "gray" : "#e535ab",
              borderWidth: "2px",
              borderRadius: "9%",
              position: "absolute",
              right: "2%",
              size: "small"
            }}
              variant="outlined"
              disabled={isCheckBoxActive && checkBoxSelection.length !== 2 ? true : false}
              onClick={() => manageCompareAction()}
            >
              Compare
            </Button>

          */}
              </Stack>

              <Box sx={{ marginTop: '0.8%', marginBottom: '0.8%' }}>
                <FormControl sx={{ minWidth: '10.2%' }} size="small">
                  <InputLabel>Test Runs</InputLabel>
                  <Select
                    data-testid="TestRuns"
                    value={testRunSelection}
                    onChange={handleChangeTestRunSelection}
                    label="Test Runs"
                  >
                    <MenuItem value={'*'}>All Test Runs</MenuItem>
                    <MenuItem data-testid="Master Only" value={'master'}>
                      Master Only
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ marginLeft: '1.2%', minWidth: '9%' }} size="small">
                  <InputLabel>Machine</InputLabel>
                  <Select
                    data-testid="Machines"
                    value={machineSelection}
                    onChange={handleChangeMachineSelection}
                    label="Machine"
                  >
                    <MenuItem value={'*'}>All Machines</MenuItem>
                    {machineNames.map((machine, index) => {
                      return (
                        <MenuItem key={index} value={machine}>
                          {machine}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>

              {isCheckBoxActive === true ? (
                checkBoxSelection.length > 2 ? (
                  <Alert data-testid="alert-warning" severity="warning" sx={{ width: '30%', marginTop: '1.6%' }}>
                    You can only select 2 test runs to compare!
                  </Alert>
                ) : checkBoxSelection.length === 2 ? (
                  <Alert data-testid="alert-succes" severity="success" sx={{ width: '30%', marginTop: '1.6%' }}>
                    Nice selection! You can now compare this 2 test runs
                  </Alert>
                ) : (
                  <Alert data-testid="alert-info" severity="info" sx={{ width: '30%', marginTop: '1.6%' }}>
                    Select {2 - checkBoxSelection.length} Test Runs to compare
                  </Alert>
                )
              ) : null}

              <TestRunsTable
                onCheckboxChange={onCheckboxChange}
                isCheckBoxActive={isCheckBoxActive}
                testRunResults={testRunResults}
                sortTests={sortTests}
              />
            </Box>
          </Stack>

          <Box sx={{ width: '100%', bottom: '5%', position: 'absolute' }}>
            <Typography variant="h7" sx={{ color: 'gray', left: '3%', position: 'absolute' }}>
              <b>v1.0</b>
            </Typography>

            <Typography variant="h7" sx={{ color: 'gray', right: '3%', position: 'absolute' }}>
              Created by Twitter, Inc.
            </Typography>
          </Box>
        </div>
      )}
    </div>
  );
}
