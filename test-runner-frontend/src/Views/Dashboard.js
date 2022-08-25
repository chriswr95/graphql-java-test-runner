import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
//import Button from '@mui/material/Button';
import GraphQL_Logo from '../Assets/GraphQL_Java_Logo_v2.png';
import Alert from '@mui/material/Alert';
import { useEffect } from 'react';
import { onSnapshot, collection } from '@firebase/firestore';
import { useReducer } from 'react';
import db from './firebase';
import TestRunsTable from '../Components/TestRunsTable';
//import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import { getMachineNames, sortTestRunsByMachine, getBenchmarksByMachine, getAllBenchmarks } from './DashboardUtils';

const initialState = {
  isCheckBoxActive: false,
  //cancelButtonState: false,
  testResults: [],
  loadingState: true,
  testRunResults: [],
  testRunResultsCopy: [],
  testRunSelection: 'All Test Runs',
  machineSelection: 'All Machines',
  checkBoxSelection: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'isCheckBoxActive':
      return { ...state, isCheckBoxActive: action.payload };
    case 'testResults':
      return { ...state, testResults: action.payload };
    case 'loadingState':
      return { ...state, loadingState: action.payload };
    case 'testRunResults':
      return { ...state, testRunResults: action.payload };
    case 'testRunResultsCopy':
      return { ...state, testRunResultsCopy: action.payload };
    case 'testRunSelection':
      return { ...state, testRunSelection: action.payload };
    case 'machineSelection':
      return { ...state, machineSelection: action.payload };
    case 'checkBoxSelection':
      return { ...state, checkBoxSelection: action.payload };
    case 'compare':
      return {
        ...state,
        testRunResultsCopy: action.payload,
        testRunResults: action.payload,
        loadingState: action.payload,
      };
    default:
      return state;
  }
};

export default function Dashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    isCheckBoxActive,
    //cancelButtonState,
    testResults,
    loadingState,
    testRunResults,
    testRunResultsCopy,
    testRunSelection,
    machineSelection,
    checkBoxSelection,
  } = state;

  const FIRESTORE_COLLECTION_NAME = 'test-runs';

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

  useEffect(
    () => () =>
      onSnapshot(collection(db, FIRESTORE_COLLECTION_NAME), (snapshot) =>
        dispatch({ type: 'testResults', payload: snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) })
      ),
    []
  );

  useEffect(() => {
    compareBenchmarks(testResults);
    // eslint-disable-next-line
  }, [testResults]);

  const compareBenchmarks = (testRunResults) => {
    const machines = getMachineNames(testRunResults);
    const sortedTestRuns = sortTestRunsByMachine(machines, testRunResults);
    const benchmarksByMachine = getBenchmarksByMachine(sortedTestRuns);
    const allBenchmarks = getAllBenchmarks(benchmarksByMachine);
    dispatch({ type: 'compare', payload: allBenchmarks });
  };

  const drowpdownMenusManager = React.useCallback(() => {
    if (testRunSelection === 'Master Only') {
      if (machineSelection === 'All Machines') {
        dispatch({ type: 'testRunResults', payload: testRunResultsCopy.filter((test) => test.branch === 'master') });
      } else {
        dispatch({
          type: 'testRunResults',
          payload: testRunResultsCopy
            .filter((test) => test.branch === 'master')
            .filter((test) => test.machine === machineSelection),
        });
      }
    } else {
      if (machineSelection === 'All Machines') {
        dispatch({ type: 'testRunResults', payload: testRunResultsCopy });
      } else {
        dispatch({
          type: 'testRunResults',
          payload: testRunResultsCopy.filter((test) => test.machine === machineSelection),
        });
      }
    }
  }, [testRunSelection, machineSelection, testRunResultsCopy]);

  const handleChangeTestRunSelection = (event) => {
    dispatch({ type: 'testRunSelection', payload: event.target.value });
  };

  const handleChangeMachineSelection = (event) => {
    dispatch({ type: 'machineSelection', payload: event.target.value });
  };

  function sortDate() {
    var testRunsResultsSorted = testRunResultsCopy;
    dispatch({ type: 'testRunResults', payload: [].concat(testRunsResultsSorted).sort((a, b) => a.date - b.date) });
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
    dispatch({ type: 'testRunResultsCopy', payload: testRunResultsCopy });
  };

  useEffect(() => {
    drowpdownMenusManager();
  }, [drowpdownMenusManager]);

  useEffect(() => {
    drowpdownMenusManager();
  }, [drowpdownMenusManager]);

  return (
    <div>
      {loadingState === true ? (
        <CircularProgress color="secondary" />
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
                  <Select value={testRunSelection} onChange={handleChangeTestRunSelection} label="Test Runs">
                    <MenuItem value={'All Test Runs'}>All Test Runs</MenuItem>
                    <MenuItem data-testid="Master Only" value={'Master Only'}>
                      Master Only
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ marginLeft: '1.2%', minWidth: '9%' }} size="small">
                  <InputLabel>Machine</InputLabel>
                  <Select value={machineSelection} onChange={handleChangeMachineSelection} label="Machine">
                    <MenuItem value={'All Machines'}>All Machines</MenuItem>
                    <MenuItem value={'core_32'}>core_32</MenuItem>
                    <MenuItem value={'core_2'}>core_2</MenuItem>
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
                sortDate={sortDate}
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
