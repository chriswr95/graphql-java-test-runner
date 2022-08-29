import {
  selectedTestRunFromDashboard,
  buildChartsDataExpectedResult,
  buildJsonResultsExpectedResult,
  benchmarks,
  jsonData,
} from '../Assets/testRunnerTestUtils';
import { buildChartsData, buildJsonResults, downloadJSON } from './ReportUtils';

describe('ReportUtils', () => {
  test('Check buildChartsData()', async () => {
    const sortedByClassNameClassesAndBenchmarks = await buildChartsData(selectedTestRunFromDashboard);
    expect(sortedByClassNameClassesAndBenchmarks).toEqual(buildChartsDataExpectedResult);
  });

  test('Check buildJsonResults()', async () => {
    const jsonResults = await buildJsonResults(benchmarks);
    expect(jsonResults).toEqual(buildJsonResultsExpectedResult);
  });

  test('Check downloadJSON()', async () => {
    window.URL.createObjectURL = function () {};
    const jsonBnechmark = 'IntMapBenchmark-thrpt';
    const jobId = '1fb3e130-2246-11ed-861d-0242ac120002-core_32';
    const jsonResultsFileNameExpectedResult = 'IntMapBenchmark-thrpt-1fb3e130-2246-11ed-861d-0242ac120002-core_32.json';
    const jsonResultsFileName = await downloadJSON(jsonBnechmark, jobId, jsonData);
    expect(jsonResultsFileName).toEqual(jsonResultsFileNameExpectedResult);
  });
});
