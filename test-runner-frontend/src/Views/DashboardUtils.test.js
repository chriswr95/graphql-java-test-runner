import {
  convertToMapTestExpectedResult,
  testRunnerTestUtils,
  sortedTestRunsByMachineTestExpectedResult,
  sortedTestRuns,
  benchmarksByMachineTestExpectedResults,
  benchmarksByMachine,
  allBenchmarksTestExpectedResults,
} from '../Assets/testRunnerTestUtils';
import {
  getMachineNames,
  sortTestRunsByMachine,
  getBenchmarksByMachine,
  getAllBenchmarks,
  filterModesByHighersIsBetterOrLowerIsBetter,
  compare,
  convertToMap,
} from './DashboardUtils';

const HIGHER_IS_BETTER = 'higherIsBetter';
const LOWER_IS_BETTER = 'lowerIsBetter';

const modeData = {
  thrpt: HIGHER_IS_BETTER,
  avgt: LOWER_IS_BETTER,
  sample: LOWER_IS_BETTER,
  ss: LOWER_IS_BETTER,
  all: LOWER_IS_BETTER,
};

describe('DashboardUtils', () => {
  test('Check getMachineNames()', async () => {
    const machinesExpectedResult = ['core_2', 'core_32'];
    const machines = await getMachineNames(testRunnerTestUtils);
    expect(machines).toEqual(machinesExpectedResult);
  });

  test('Check filterModesByHighersIsBetterOrLowerIsBetter() with higherIsBetter', async () => {
    const modesForHigherIsBetterExpectedResults = ['thrpt'];
    const modesForHigherIsBetter = await filterModesByHighersIsBetterOrLowerIsBetter(modeData, true);
    expect(modesForHigherIsBetter).toEqual(modesForHigherIsBetterExpectedResults);
  });

  test('Check filterModesByHighersIsBetterOrLowerIsBetter() with lowerIsBetter', async () => {
    const modesForHigherIsBetterExpectedResults = ['avgt', 'sample', 'ss', 'all'];
    const modesForHigherIsBetter = await filterModesByHighersIsBetterOrLowerIsBetter(modeData, false);
    expect(modesForHigherIsBetter).toEqual(modesForHigherIsBetterExpectedResults);
  });

  test('Check compare()', async () => {
    const score = 0.013987612463;
    const comparisonScore = 0.021291482132;

    const compareThrpt = await compare(score, comparisonScore, 'thrpt');
    expect(compareThrpt).toEqual('regressed');

    const compareAvgt = await compare(score, comparisonScore, 'avgt');
    expect(compareAvgt).toEqual('improved');

    const compareNoChange = await compare(1.03987123, 1.03987123, 'ss');
    expect(compareNoChange).toEqual('no change');
  });

  test('Check converToMap()', async () => {
    const testRunConvertedToMap = await convertToMap(convertToMapTestExpectedResult);
    const testRunConvertedToMapExpectedResult = {
      'benchmark.AddError.benchMarkAddError': {
        mode: 'ss',
        score: 0.5638389252,
      },
    };
    expect(testRunConvertedToMap).toEqual(testRunConvertedToMapExpectedResult);
  });

  test('Check sortTestRunsByMachine()', async () => {
    const machines = ['core_2', 'core_32'];
    const sortedTestRunsByMachine = await sortTestRunsByMachine(machines, testRunnerTestUtils);
    expect(sortedTestRunsByMachine).toEqual(sortedTestRunsByMachineTestExpectedResult);
  });

  test('Check getBenchmarksByMachine()', async () => {
    const benchmarksByMachine = await getBenchmarksByMachine(sortedTestRuns);
    expect(benchmarksByMachine).toEqual(benchmarksByMachineTestExpectedResults);
  });

  test('Check getAllBenchmarks()', async () => {
    const allBenchmarks = await getAllBenchmarks(benchmarksByMachine);
    expect(allBenchmarks).toEqual(allBenchmarksTestExpectedResults);
  });
});
