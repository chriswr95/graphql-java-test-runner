import {
  selectedTestRunFromDashboard,
  buildChartsDataExpectedResult,
  buildJsonResultsExpectedResult,
  benchmarks,
  jsonData,
} from '../Assets/testRunnerTestUtils';
import { buildChartsData, buildJsonResults, downloadJSON } from './ReportAndCompareUtils';

describe('ReportUtils', () => {
  test('Check buildChartsData()', async () => {
    const sortedByClassNameClassesAndBenchmarks = await buildChartsData(selectedTestRunFromDashboard);
    expect(sortedByClassNameClassesAndBenchmarks).toEqual(buildChartsDataExpectedResult);
  });

  test('Check buildJsonResults()', async () => {
    const jsonResults = await buildJsonResults(benchmarks);
    expect(jsonResults).toEqual(buildJsonResultsExpectedResult);
  });
});
