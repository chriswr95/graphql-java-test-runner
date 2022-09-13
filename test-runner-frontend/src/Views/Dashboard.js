import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import GraphQL_Logo from '../Assets/GraphQL_Java_Logo_v2.png';
import Alert from '@mui/material/Alert';
import { useEffect, useReducer, useContext } from 'react';
import TestRunsTable from '../Components/TestRunsTable';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import { FirestoreContext } from '../Components/FirestoreProvider';

const GRAPHQL_JAVA_GITHUB = 'https://github.com/graphql-java/graphql-java';

const initialState = {
  isCheckBoxActive: false,
  cancelButtonState: false,
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
      return {
        ...state,
        testRunResults: action.payload.firestoreData,
        testRunResultsCopy: action.payload.firestoreData,
        machineNames: action.payload.machines,
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
    case 'handleCheckBoxSelection':
      if (action.payload.action === 'add') {
        return { ...state, checkBoxSelection: [...state.checkBoxSelection, action.payload.selectedElement] };
      } else if (action.payload.action === 'remove') {
        return {
          ...state,
          checkBoxSelection: [
            ...state.checkBoxSelection.filter(
              (checkBoxSelection) => checkBoxSelection !== action.payload.selectedElement
            ),
          ],
        };
      } else {
        return { ...state, checkBoxSelection: [] };
      }
    case 'compare':
      return {
        ...state,
        testRunResultsCopy: action.payload,
        testRunResults: action.payload,
      };
    case 'cancelButtonState':
      return {
        ...state,
        cancelButtonState: action.payload,
      };
    case 'sortResults':
      const sortingMode = action.payload.key;
      const sortingBy = action.payload.sortBy;
      if (sortingBy === 'ascending') {
        return {
          ...state,
          checkBoxSelection: [],
          testRunResults: [].concat(state.testRunResultsCopy).sort((a, b) => a[sortingMode] - b[sortingMode]),
        };
      } else if (sortingBy === 'descending') {
        return {
          ...state,
          checkBoxSelection: [],
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

  const { loading, firestoreData, machines } = useContext(FirestoreContext);

  const {
    isCheckBoxActive,
    cancelButtonState,
    testRunResults,
    testRunSelection,
    machineSelection,
    checkBoxSelection,
    machineNames,
  } = state;

  const navigate = useNavigate();

  function manageCompareAction() {
    if (checkBoxSelection.length >= 2) {
      dispatch({ type: 'handleCheckBoxSelection', payload: 'empty' });
      navigate(`?compareA=${checkBoxSelection[0].id}&compareB=${checkBoxSelection[1].id}`);
    }
    dispatch({ type: 'handleCheckBoxSelection', payload: 'empty' });
    dispatch({ type: 'isCheckBoxActive', payload: !isCheckBoxActive });
    dispatch({ type: 'cancelButtonState', payload: !cancelButtonState });
  }

  const handleCancel = () => {
    dispatch({ type: 'handleCheckBoxSelection', payload: 'empty' });
    dispatch({ type: 'isCheckBoxActive', payload: false });
    dispatch({ type: 'cancelButtonState', payload: false });
  };

  useEffect(() => {
    if (firestoreData !== undefined) dispatch({ type: 'saveFirestore', payload: { firestoreData, machines } });
  }, [firestoreData, machines]);

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
    if (checkBoxSelection.find((checkBoxSelection) => checkBoxSelection === childToParentData)) {
      dispatch({ type: 'handleCheckBoxSelection', payload: { selectedElement: childToParentData, action: 'remove' } });
    } else {
      dispatch({ type: 'handleCheckBoxSelection', payload: { selectedElement: childToParentData, action: 'add' } });
    }
  };

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            marginTop: 0,
            marginLeft: 0,
          }}
        >
          <CircularProgress style={{ width: '7vh' }} color="secondary" />
        </Box>
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

                <Stack direction="row" spacing={2} sx={{ position: 'absolute', right: '2%' }}>
                  {cancelButtonState ? (
                    <Button
                      sx={{
                        color: 'gray',
                        borderColor: 'gray',
                        size: 'small',
                      }}
                      variant="outlined"
                      onClick={() => handleCancel()}
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button
                    sx={{
                      color: !isCheckBoxActive ? 'gray' : '#e535ab',
                      borderColor: !isCheckBoxActive ? 'gray' : '#e535ab',
                      borderWidth: '2px',
                      size: 'small',
                    }}
                    variant="outlined"
                    disabled={isCheckBoxActive && checkBoxSelection.length !== 2 ? true : false}
                    onClick={() => manageCompareAction()}
                  >
                    Compare
                  </Button>
                </Stack>
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
