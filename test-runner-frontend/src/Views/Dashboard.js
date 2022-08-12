import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import GraphQL_Logo from "../Assets/GraphQL_Java_Logo_v2.png";
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

export function Dashboard() {

  const [isCheckBoxActive, setCheckboxActiveState] = React.useState(false);

  const [cancelButtonState, setCancelButtonState] = React.useState(false);

  var branchArray = [
    'master',
    'add_error_logs',
    'save_data'
  ];

  var statusArray = [
    'FAILED',
    'FINISHED',
  ];

  var machinesArray = [
    'e2-standard-2',
    'e2-standard-32',
  ];

  const [testResults, setTestResults] = useState([]);

  const navigate = useNavigate();


  function manageCompareAction() {
    if (checkBoxSelection.length >= 0) {
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

  /*
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
  
*/


  const [testRunResults, setTestRunResults] = useState([
    {
      id: '2c89206c-1929-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 4:35 pm"
    },
    {
      id: '84598338-1931-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 4:40 pm"
    },
    {
      id: 'ac9cc066-192d-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 4:51 pm"
    },
    {
      id: 'f71da006-1937-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 6:35 pm"
    },
    {
      id: '888fafca-192e-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 7:02 pm"
    },
    {
      id: '6f7b7ed0-1981-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 8:35 pm"
    },
    {
      id: 'a7b884b4-1981-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 8:59 pm"
    },
    {
      id: 'a1224f86-1981-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 9:12 pm"
    },
    {
      id: 'af2ac950-1981-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 10:42 pm"
    },


  ]);

  const [allRows, setAllRows] = useState([
    {
      id: '2c89206c-1929-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 4:35 pm"
    },
    {
      id: '84598338-1931-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 4:40 pm"
    },
    {
      id: 'ac9cc066-192d-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 4:51 pm"
    },
    {
      id: 'f71da006-1937-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 6:35 pm"
    },
    {
      id: '888fafca-192e-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 7:02 pm"
    },
    {
      id: '6f7b7ed0-1981-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 8:35 pm"
    },
    {
      id: 'a7b884b4-1981-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 8:59 pm"
    },
    {
      id: 'a1224f86-1981-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 9:12 pm"
    },
    {
      id: 'af2ac950-1981-11ed-861d-0242ac120002',
      branch: branchArray[Math.floor(Math.random() * branchArray.length)],
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
      benchmarks: 12,
      improvedVsRegressed: {
        improved: 8,
        regressed: 4
      },
      machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
      date: "12/08/2022 10:42 pm"
    },


  ]);



  const buildRows = () => {
    testResults?.sort((a, b) => b.testRunnerResults.core_32.startTime - a.testRunnerResults.core_32.startTime);
    testResults?.map((test, index) => {
      var timestamp = test.testRunnerResults.core_32.startTime;
      var date = new Date(timestamp * 26);
      const newObj = {
        id: test.commitHash,
        //branch: textArray[Math.floor(Math.random()*textArray.length)],
        status: test.status.core_32,
        benchmarks: test.testRunnerResults.core_32.testStatistics?.length,
        improvedVsRegresed: compareBenchmarks(testResults[index], testResults[index + 1] ? testResults[index + 1] : []),
        machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
        date: date.toLocaleString(),
      }
      setTestRunResults(testRunResults => [...testRunResults, newObj]);
      setAllRows(allRows => [...allRows, newObj]);
      console.log(newObj.improvedVsRegresed);
    })
  };


  const compareBenchmarks = (currentTestRun, previousTestRun) => {
    var results = {
      improved: 0,
      regressed: 0
    };

    for (var i = 0; i < currentTestRun.testRunnerResults?.core_32.testStatistics?.length; i++) {
      for (var j = 0; j < previousTestRun.testRunnerResults?.core_32.testStatistics?.length; j++) {
        if (currentTestRun.testRunnerResults?.core_32.testStatistics?.[i].benchmark === previousTestRun.testRunnerResults?.core_32.testStatistics?.[j].benchmark) {
          if (currentTestRun.testRunnerResults?.core_32.testStatistics?.[i].primaryMetric.score >= previousTestRun.testRunnerResults?.core_32.testStatistics?.[j].primaryMetric.score) {
            results.improved++;
          } else {
            results.regressed++;
          }
        }
      }
    }
    return results;
  }



  const [testRunSelection, setTestRunSelection] = useState('All Test Runs');
  const [machineSelection, setMachineSelection] = useState('All Machines');


  const drowpdownMenusManager = () => {
    if (testRunSelection === "Master Only") {
      if (machineSelection === "All Machines") {
        setTestRunResults(allRows.filter(test => test.branch === "master"));
      } else {
        setTestRunResults(allRows
          .filter(test => test.branch === "master")
          .filter(test => test.machine === machineSelection)
        );
      }
    }
    else {
      if (machineSelection === "All Machines") {
        setTestRunResults(allRows);
      } else {
        setTestRunResults(allRows.filter(test => test.machine === machineSelection));
      }
    }
  }

  const handleChangeTestRunSelection = (event) => {
    setTestRunSelection(event.target.value);
  };

  const handleChangeMachineSelection = (event) => {
    setMachineSelection(event.target.value);
  };


  const sortDate = () => {
    allRows?.sort((a, b) => b.date - a.date);
    setTestRunResults(allRows);
  }

  const [checkBoxSelection, setCheckBoxSelection] = React.useState([]);

  const updateSelectedTestRunsToCompare = (childToParentData) => {
    if (checkBoxSelection.find(checkBoxSelection => checkBoxSelection === childToParentData))
      setCheckBoxSelection(checkBoxSelection.filter(checkBoxSelection => checkBoxSelection !== childToParentData))
    else
      setCheckBoxSelection(checkBoxSelection => [...checkBoxSelection, childToParentData]);
  }


  useEffect(() => {
    drowpdownMenusManager();
  }, [testRunSelection]);


  useEffect(() => {
    drowpdownMenusManager();
  }, [machineSelection]);


  return (
    <div>

      <img
        style={{
          marginLeft: "2%",
          marginTop: "0.5%",
          marginBottom: "0.7%",
          width: "18%"
        }}
        src={GraphQL_Logo}
        alt="GraphQL Java Logo"
      />

      <Typography sx={{ marginLeft: "2%", marginBottom: "0.4%" }} variant="h4">
        <b>Summary</b>
      </Typography>
      <br></br>


      <Stack sx={{ marginBottom: "2%" }} direction="row" spacing={9}>

        <Box
          sx={{
            width: "100%",
            marginLeft: "2%",
            marginRight: "2%",
          }}>
          <Stack direction="row">
            <Typography variant="h5">
              <b>Test Run</b>
            </Typography>
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
          </Stack>


          <Box sx={{ marginTop: "0.7%", marginBottom: "0.8%" }}>
            <FormControl sx={{ minWidth: '10.2%' }} size="small">
              <InputLabel>Test Runs</InputLabel>
              <Select
                value={testRunSelection}
                onChange={handleChangeTestRunSelection}
                label="Test Runs"
              >
                <MenuItem value={'All Test Runs'}>All Test Runs</MenuItem>
                <MenuItem value={'Master Only'}>Master Only</MenuItem>
              </Select>
            </FormControl>



            <FormControl sx={{ marginLeft: "1.2%", minWidth: '9%' }} size="small">
              <InputLabel>Machine</InputLabel>
              <Select
                value={machineSelection}
                onChange={handleChangeMachineSelection}
                label="Machine"
              >
                <MenuItem value={'All Machines'}>All Machines</MenuItem>
                <MenuItem value={'e2-standard-32'}>e2-standard-32</MenuItem>
                <MenuItem value={'e2-standard-2'}>e2-standard-2</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {
            isCheckBoxActive === true
              ?
              checkBoxSelection.length > 2
                ?
                <Alert severity="warning" sx={{ width: "30%", marginTop: "1.6%" }}>You can only select 2 test runs to compare!</Alert>
                :
                checkBoxSelection.length === 2
                  ?
                  <Alert severity="success" sx={{ width: "30%", marginTop: "1.6%" }}>Nice selection! You can now compare this 2 test runs</Alert>
                  :
                  <Alert severity="info" sx={{ width: "30%", marginTop: "1.6%" }}>Select {2 - checkBoxSelection.length} Test Runs to compare</Alert>
              :
              null
          }

          <TestRunsTable updateSelectedTestRunsToCompare={updateSelectedTestRunsToCompare} isCheckBoxActive={isCheckBoxActive} testRunResults={testRunResults} sortDate={sortDate} />

        </Box>

      </Stack>



      <Box sx={{ width: "100%", bottom: "5%", position: 'absolute' }} >

        <Typography variant="h7" sx={{ color: "gray", left: "3%", position: 'absolute' }} >
          <b>v1.0</b>
        </Typography>

        <Typography variant="h7" sx={{ color: "gray", left: "9%", position: 'absolute' }} >
          Updated July, 2022
        </Typography>



        <Typography variant="h7" sx={{ color: "gray", right: "3%", position: 'absolute' }} >
          Created by Twitter, Inc.
        </Typography>

      </Box>


    </div>
  );
}
