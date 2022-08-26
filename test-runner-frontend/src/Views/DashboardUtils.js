const HIGHER_IS_BETTER = 'higherIsBetter';
const LOWER_IS_BETTER = 'lowerIsBetter';

const modeData = {
  thrpt: HIGHER_IS_BETTER,
  avgt: LOWER_IS_BETTER,
  sample: LOWER_IS_BETTER,
  ss: LOWER_IS_BETTER,
  all: LOWER_IS_BETTER,
};

export const getMachineNames = (testRunResults) => {
  const machinesSet = new Set();
  testRunResults?.forEach((testRunResult) => {
    Object.keys(testRunResult?.status).forEach((machine) => {
      machinesSet.add(machine);
    });
  });

  return Array.from(machinesSet);
};

export const filterModesByHighersIsBetterOrLowerIsBetter = (modeData, isHigherBetter) => {
  const valueToFilter = isHigherBetter ? HIGHER_IS_BETTER : LOWER_IS_BETTER;
  return Object.entries(modeData)
    .filter(([key, value]) => value === valueToFilter)
    .map(([modeDataName]) => modeDataName);
};

export const compare = (score, comparisonScore, mode) => {
  const modesWhereLowerIsBetter = filterModesByHighersIsBetterOrLowerIsBetter(modeData, false);
  const modesWhereHigherIsBetter = filterModesByHighersIsBetterOrLowerIsBetter(modeData, true);
  const scoreDifference = score - comparisonScore;

  var result = '';

  if (modesWhereHigherIsBetter.includes(mode) && scoreDifference)
    result = scoreDifference > 0 ? 'improved' : 'regressed';
  else if (modesWhereLowerIsBetter.includes(mode) && scoreDifference)
    result = scoreDifference < 0 ? 'improved' : 'regressed';
  else result = 'no change';

  return result;
};

export const sortTestRunsByMachine = (machines, testRunResults) => {
  return machines.map((machineName) => {
    const testDataForSpecificMachine = testRunResults.map((testRunResult) => {
      const id = testRunResult.jobId + '-' + machineName;
      const commitHash = testRunResult.commitHash;
      const branch = testRunResult.branch;
      const status = testRunResult.status[machineName];
      const machine = machineName;
      if (testRunResult.testRunnerResults) {
        const benchmarks = testRunResult.testRunnerResults[machineName]?.testStatistics?.length;
        const timestamp = testRunResult.testRunnerResults[machineName]?.startTime;
        const dateTimestamp = new Date(timestamp * 26);
        const improvedVsRegressed = { improved: 0, regressed: 0 };
        const date = dateTimestamp?.toLocaleString();
        const statistics = testRunResult.testRunnerResults[machineName]?.testStatistics;

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
    });

    return testDataForSpecificMachine;
  });
};

export const convertToMap = (testRun) => {
  if (!testRun) return null;
  return testRun?.statistics.reduce((map, testMethod) => {
    map[testMethod.benchmark] = {
      score: testMethod.primaryMetric.score,
      mode: testMethod.mode,
    };
    return map;
  }, {});
};

export const generateComparisonBetween = (currentTestRun, previousTestRun) => {
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
      } else return null;
    })
    .filter((testRun) => testRun);

  var counter = 0;

  const improvedVsRegressed = {
    improved: improvementsAndRegressions
      ?.filter((improved) => improved === 'improved')
      .reduce((improvedCounter) => improvedCounter + 1, counter),
    regressed: improvementsAndRegressions
      ?.filter((regressed) => regressed === 'regressed')
      .reduce((regressedCounter) => regressedCounter + 1, counter),
  };

  return improvedVsRegressed;
};

export const getBenchmarksByMachine = (flattenedTestRuns) => {
  const benchmarksByMachine = flattenedTestRuns.map((testRunsSortedByMachine) => {
    return testRunsSortedByMachine
      .map((testRun, index) => {
        if (testRunsSortedByMachine[index + 1] && testRunsSortedByMachine[index + 1]?.statistics) {
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

export const getAllBenchmarks = (benchmarksByMachine) => {
  return benchmarksByMachine.flat();
};
