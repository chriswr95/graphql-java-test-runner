import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import GraphQL_Logo from '../Assets/GraphQL_Java_Logo_v2.png';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import { onSnapshot, collection } from '@firebase/firestore';
import db from './firebase';
import TestRunsTable from '../Components/TestRunsTable';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Dashboard() {
  const [isCheckBoxActive, setCheckboxActiveState] = React.useState(false);

  //const [cancelButtonState, setCancelButtonState] = React.useState(false);

  var branchArray = ['master', 'add_error_logs', 'save_data'];

  var statusArray = ['FAILED', 'FINISHED'];

  var machinesArray = ['e2-standard-2', 'e2-standard-32'];

  const [testResults, setTestResults] = useState([]);

  //const navigate = useNavigate();

  /*
    function manageCompareAction() {
      if (checkBoxSelection.length >= 2) {
        setCheckBoxSelection([]);
        //navigate("/report")
      }
      setCheckBoxSelection([]);
      setCheckboxActiveState(!isCheckBoxActive);
      setCancelButtonState(!cancelButtonState);
    }


  
    const handleCancel = () => {
      setCheckBoxSelection([]);
      setCheckboxActiveState(false);
      setCancelButtonState(false);
    }
    */

  
    useEffect(() => 
        () =>
            onSnapshot(collection(db, 'test-runs'), (snapshot) => 
                setTestResults(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            ),
        []
    );

    useEffect(() => {
      //alert("Avoid infite loop builingRows")
      buildRows()
    }, [testResults]);
  


  const [testRunResults, setTestRunResults] = useState([]);
  const [testRunResultsCopy, setTestRunResultsCopy] = useState([]);

  const buildRow = (machine, testStatus, jobId, commitHash, machineType) => {
    var timestamp = machine?.startTime
    var date = new Date(timestamp * 26);
    const newTestRun = {
      id: jobId,
      commitHash: commitHash,
      branch: branchArray[Math.floor(Math.random()*branchArray.length)],
      status: testStatus,
      benchmarks: machine?.testStatistics.length,
      //improvedVsRegresed: compareBenchmarks(testResults[index], testResults[index + 1] ? testResults[index + 1] : []),
      improvedVsRegressed:{
        improved: 0,
        regressed: 0
      }, 
      machine: machineType,
      date: date.toLocaleString(),
      statistics: machine?.testStatistics,
    }
    return newTestRun;
  }

  var bestCopyEver = [];
  const buildRows = () => {
      testResults?.sort((a,b) => b.testRunnerResults?.core_32.startTime - a.testRunnerResults?.core_32.startTime);
      testResults?.map(testResult => {
        const core32_testRun = buildRow(testResult.testRunnerResults?.core_32, testResult.status?.core_32, testResult.jobId+"-32", testResult.id, "e2-standard-32");
        //setTestRunResults(testRunResults => [...testRunResults, core32_testRun]);
        setTestRunResultsCopy(testRunResultsCopy => [...testRunResultsCopy, core32_testRun]);
        bestCopyEver.push(core32_testRun);
        const core2_testRun = buildRow(testResult.testRunnerResults?.core_2, testResult.status?.core_2, testResult.jobId+"-2", testResult.id, "e2-standard-2");
        //setTestRunResults(testRunResults => [...testRunResults, core2_testRun]);
        setTestRunResultsCopy(testRunResultsCopy => [...testRunResultsCopy, core2_testRun]);
        bestCopyEver.push(core2_testRun);
      });
      setBenchmarks(0);
      //buildRowsv2();
  };

  //Dynamic cores
  const buildRowsv2 = () => {
    testResults?.sort((a,b) => b.testRunnerResults?.core_32.startTime - a.testRunnerResults?.core_32.startTime);
    testResults?.map(testResult => {
      console.log(testResult);
      Object.entries(testResult.testRunnerResults)?.map(([key, value]) => { 
                //const testRun = buildRow(testResult.testRunnerResults?.core_32, testResult.status?.core_32, testResult.jobId+"-32", testResult.id, "e2-standard-32");
                //setTestRunResultsCopy(testRunResultsCopy => [...testRunResultsCopy, testRun]);
                //bestCopyEver.push(testRun);
                console.log("1");
                console.log(key);
                console.log("2");
                //console.log(value);
    })
    });
  }

  const setBenchmarks = (index) => {
    compareBenchmarks(index);
    setTestRunResults(bestCopyEver);
  }

  const compareBenchmarks = (index) => {
    var results = {
      improved: 0,
      regressed: 0
    };

    if(index <= bestCopyEver.length){
    var currentTestRun = bestCopyEver[index]?.statistics;
    var previousTestRun = bestCopyEver[index+2]?.statistics;

    for (var i = 0; i < currentTestRun?.length; i++) {
      for (var j = 0; j < previousTestRun?.length; j++) {
        if (currentTestRun[i].benchmark === previousTestRun[j].benchmark) {
          if (currentTestRun[i].primaryMetric.score >= previousTestRun[j].primaryMetric.score) {
            results.improved++;
          } else {
            results.regressed++;
          }
        }
      }
    }

    if(bestCopyEver[index]?.improvedVsRegressed.improved === 0){
      bestCopyEver[index].improvedVsRegressed = results;
    }
    compareBenchmarks(index+1);
    }
  }

  const modeData = {
    thrpt: "higherIsBetter",
    avgt: "lowerIsBetter",
    sample: "higherIsBetter",
    ss: "lowerIsBetter",
    all: "higherIsBetter"
  }

  const compareBenchmarksv2 = (testRunResults, modeData) => {
    var modesWhereHigherIsBetter = [];
    var modesWhereLowerIsBetter = [];

    for(const [key, value] of Object.entries(modeData)){
      if(value === "higherIsBetter")
        modesWhereHigherIsBetter.push(key);
      else if(value === "lowerIsBetter")
        modesWhereLowerIsBetter.push(key);
    }

    Object.entries(modeData).filter(([key, value]) => value === "higherIsBetter")
  }

  const [testRunSelection, setTestRunSelection] = useState('All Test Runs');
  const [machineSelection, setMachineSelection] = useState('All Machines');

  const drowpdownMenusManager = React.useCallback(() => {
    if (testRunSelection === 'Master Only') {
      if (machineSelection === 'All Machines') {
        setTestRunResults(testRunResultsCopy.filter((test) => test.branch === 'master'));
      } else {
        setTestRunResults(
          testRunResultsCopy
            .filter((test) => test.branch === 'master')
            .filter((test) => test.machine === machineSelection)
        );
      }
    } else {
      if (machineSelection === 'All Machines') {
        setTestRunResults(testRunResultsCopy);
      } else {
        setTestRunResults(testRunResultsCopy.filter((test) => test.machine === machineSelection));
      }
    }
  }, [testRunSelection, machineSelection, testRunResultsCopy]);

  const handleChangeTestRunSelection = (event) => {
    setTestRunSelection(event.target.value);
  };

  const handleChangeMachineSelection = (event) => {
    setMachineSelection(event.target.value);
  };

  function sortDate() {
    var testRunsResultsSorted = testRunResultsCopy;
    setTestRunResults([].concat(testRunsResultsSorted).sort((a, b) => b.date - a.date));
  }

  const [checkBoxSelection, setCheckBoxSelection] = React.useState([]);

  const onCheckboxChange = (childToParentData) => {
    if (checkBoxSelection.find((checkBoxSelection) => checkBoxSelection === childToParentData))
      setCheckBoxSelection(checkBoxSelection.filter((checkBoxSelection) => checkBoxSelection !== childToParentData));
    else setCheckBoxSelection((checkBoxSelection) => [...checkBoxSelection, childToParentData]);
    setCheckboxActiveState(false);
    setTestRunResultsCopy(testRunResultsCopy);
  };

  useEffect(() => {
    drowpdownMenusManager();
  }, [drowpdownMenusManager]);

  useEffect(() => {
    drowpdownMenusManager();
  }, [drowpdownMenusManager]);

  return (
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
                <MenuItem value={'e2-standard-32'}>e2-standard-32</MenuItem>
                <MenuItem value={'e2-standard-2'}>e2-standard-2</MenuItem>
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
            checkBoxSelection={checkBoxSelection}
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

        <Typography variant="h7" sx={{ color: 'gray', left: '9%', position: 'absolute' }}>
          Updated July, 2022
        </Typography>

        <Typography variant="h7" sx={{ color: 'gray', right: '3%', position: 'absolute' }}>
          Created by Twitter, Inc.
        </Typography>
      </Box>
    </div>
  );
}
