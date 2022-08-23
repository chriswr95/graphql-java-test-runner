import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
//import Button from '@mui/material/Button';
import GraphQL_Logo from '../Assets/GraphQL_Java_Logo_v2.png';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import { onSnapshot, collection } from '@firebase/firestore';
import db from './firebase';
import TestRunsTable from '../Components/TestRunsTable';
//import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';

export default function Dashboard() {
  const [isCheckBoxActive, setCheckboxActiveState] = React.useState(false);

  //const [cancelButtonState, setCancelButtonState] = React.useState(false);

  const [testResults, setTestResults] = useState([]);

  const [loadingState, setLoadingState] = useState(true);

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

  useEffect(
    () => () =>
      onSnapshot(collection(db, 'test-runs'), (snapshot) =>
        setTestResults(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );

  useEffect(() => {
    compareBenchmarks(testResults);
    // eslint-disable-next-line
  }, [testResults]);

  const [testRunResults, setTestRunResults] = useState([]);
  const [testRunResultsCopy, setTestRunResultsCopy] = useState([]);
  const [testRunSelection, setTestRunSelection] = useState('All Test Runs');
  const [machineSelection, setMachineSelection] = useState('All Machines');

  const HIGHER_IS_BETTER = 'higherIsBetter';
  const LOWER_IS_BETTER = 'lowerIsBetter';

  const modeData = {
    thrpt: HIGHER_IS_BETTER,
    avgt: LOWER_IS_BETTER,
    sample: HIGHER_IS_BETTER,
    ss: LOWER_IS_BETTER,
    all: HIGHER_IS_BETTER,
  };

  const getMachineNames = (testRunResults) => {
    var machines = [];
    testRunResults.forEach((testRunResult) => {
      Object.keys(testRunResult?.status).forEach((machine) => {
        if (!machines.includes(machine)) {
          machines.push(machine);
        }
      });
    });

    return machines;
  };

  const helper = (modeData, isHigherBetter) => {
    const valueToFilter = isHigherBetter ? HIGHER_IS_BETTER : LOWER_IS_BETTER;
    return Object.entries(modeData)
      .filter(([key, value]) => value === valueToFilter)
      .map(([first]) => first);
  };

  const sortTestRunsByMachine = (machines, testRunResults) => {
    return machines.map((machineName) => {
      const testDataForSpecificMachine = testRunResults
        .map((testRunResult) => {
          const id = testRunResult.jobId + '-' + machineName;
          const commitHash = testRunResult.commitHash;
          const branch = testRunResult.branch;
          const status = testRunResult.status[machineName];
          const machine = machineName;
          if (testRunResult.testRunnerResults) {
            const benchmarks = testRunResult.testRunnerResults[machineName]?.testStatistics?.length;
            const timestamp = testRunResult.testRunnerResults[machineName].startTime;
            const dateTimestamp = new Date(timestamp * 26);
            const improvedVsRegressed = { improved: 0, regressed: 0 };
            const date = dateTimestamp.toLocaleString();
            const statistics = testRunResult.testRunnerResults[machineName].testStatistics;

            return {
              id,
              commitHash,
              branch,
              status,
              benchmarks,
              improvedVsRegressed,
              machine,
              date,
              statistics,
            };
          } else {
            return {
              id,
              commitHash,
              branch,
              status,
              benchmarks: 0,
              improvedVsRegressed: {},
              machine,
              date: 'Test run on progress',
              statistics: [],
            };
          }
        })
        .filter((testData) => testData);

      return testDataForSpecificMachine;
    });
  };

  const convertToMap = (testRun) => {
    if (!testRun) return null;
    return testRun?.statistics.reduce((map, testMethod) => {
      map[testMethod.benchmark] = {
        score: testMethod.primaryMetric.score,
        mode: testMethod.mode,
      };
      return map;
    }, {});
  };

  const compare = (score, comparisonScore, mode) => {
    const modesWhereLowerIsBetter = helper(modeData, false);
    const modesWhereHigherIsBetter = helper(modeData, true);
    const scoreDifference = score - comparisonScore;

    var result = '';

    if (modesWhereHigherIsBetter.includes(mode)) result = scoreDifference > 0 ? 'improved' : 'regressed';
    else if (modesWhereLowerIsBetter.includes(mode)) result = scoreDifference < 0 ? 'improved' : 'regressed';
    else result = 'No change';

    return result;
  };

  const generateComparisonBetween = (currentTestRun, previousTestRun) => {
    const currentTestRunModeAndScore = currentTestRun.statistics?.map((testMethod) => [
      testMethod.benchmark,
      testMethod.mode,
      testMethod.primaryMetric.score,
    ]);

    const previousTestRunModeAndScore = convertToMap(previousTestRun);

    let improvementsAndRegressions = currentTestRunModeAndScore
      ?.map(([benchmark, mode, score]) => {
        const comparisonBenchmark = previousTestRunModeAndScore[benchmark];
        const comparisonMode = previousTestRunModeAndScore[benchmark]?.mode;
        const comparisonScore = previousTestRunModeAndScore[benchmark]?.score;
        if (comparisonBenchmark && comparisonMode === mode && score !== 0) {
          return compare(score, comparisonScore, mode);
        }
        return null;
      })
      .filter((testRun) => testRun);

    var counter = 0;

    const improvedVsRegressed = {
      improved: improvementsAndRegressions
        ?.filter((improved) => improved === 'improved')
        .reduce((first, second) => first + 1, counter),
      regressed: improvementsAndRegressions
        ?.filter((regressed) => regressed === 'regressed')
        .reduce((first, second) => first + 1, counter),
    };

    return improvedVsRegressed;
  };

  const flattenedSortedTestRuns = (sortedTestRuns) => {
    return sortedTestRuns.map((testRunsSortedByMachine) => {
      return testRunsSortedByMachine.map((testRun) => testRun).filter((testRun) => testRun);
    });
  };

  const getAllBenchmarks = (benchmarksByMachine) => {
    const allBenchmarks = benchmarksByMachine.flatMap((benchmarkByMachine) => {
      return benchmarkByMachine
        .map((testRun) => {
          return testRun;
        })
        .filter((testRun) => testRun);
    });

    return allBenchmarks;
  };

  const getBenchmarksByMachine = (flattenedTestRuns) => {
    const benchmarksByMachine = flattenedTestRuns.map((testRunsSortedByMachine) => {
      return testRunsSortedByMachine
        .map((testRun, index) => {
          if (testRunsSortedByMachine[index + 1] && testRunsSortedByMachine[index + 1].statistics) {
            const getImprovedVsRegressedValues = generateComparisonBetween(
              testRun,
              testRunsSortedByMachine[index + 1] ? testRunsSortedByMachine[index + 1] : {}
            );
            testRun.improvedVsRegressed.improved = getImprovedVsRegressedValues?.improved
              ? getImprovedVsRegressedValues.improved
              : 0;
            testRun.improvedVsRegressed.regressed = getImprovedVsRegressedValues?.regressed
              ? getImprovedVsRegressedValues.regressed
              : 0;
          }
          return {
            id: testRun.id,
            commitHash: testRun.commitHash,
            branch: testRun.branch,
            status: testRun.status,
            benchmarks: testRun.benchmarks,
            machine: testRun.machine,
            date: testRun.date,
            statistics: testRun.statistics,
            improvedVsRegressed: testRun.improvedVsRegressed,
          };
        })
        .filter((testRun) => testRun);
    });
    return benchmarksByMachine;
  };

  const compareBenchmarks = (testRunResults) => {
    const machines = getMachineNames(testRunResults);
    const sortedTestRuns = sortTestRunsByMachine(machines, testRunResults);
    const flattenedTestRuns = flattenedSortedTestRuns(sortedTestRuns);
    const benchmarksByMachine = getBenchmarksByMachine(flattenedTestRuns);
    const allBenchmarks = getAllBenchmarks(benchmarksByMachine);
    setTestRunResultsCopy(allBenchmarks);
    setTestRunResults(allBenchmarks);
    setLoadingState(false);
  };

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
    setTestRunResults([].concat(testRunsResultsSorted).sort((a, b) => a.date - b.date));
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
      )}
    </div>
  );
}
