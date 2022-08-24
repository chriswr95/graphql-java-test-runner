import { testRunnerTestUtils } from '../Assets/testRunnerTestUtils';
import {
  getMachineNames,
  sortTestRunsByMachine,
  getBenchmarksByMachine,
  getAllBenchmarks,
  helper,
  compare,
  convertToMap,
} from './DashboardUtils';

describe('DashboardUtils', () => {
  test('Check getMachineNames()', async () => {
    const machinesExpectedResult = ['core_2', 'core_32'];
    const machines = await getMachineNames(testRunnerTestUtils);
    expect(machines).toEqual(machinesExpectedResult);
  });

  test('Check helper() with higherIsBetter', async () => {
    const HIGHER_IS_BETTER = 'higherIsBetter';
    const LOWER_IS_BETTER = 'lowerIsBetter';

    const modeData = {
      thrpt: HIGHER_IS_BETTER,
      avgt: LOWER_IS_BETTER,
      sample: LOWER_IS_BETTER,
      ss: LOWER_IS_BETTER,
      all: LOWER_IS_BETTER,
    };

    const modesForHigherIsBetterExpectedResults = ['thrpt'];
    const modesForHigherIsBetter = await helper(modeData, true);
    expect(modesForHigherIsBetter).toEqual(modesForHigherIsBetterExpectedResults);
  });

  test('Check helper() with lowerIsBetter', async () => {
    const HIGHER_IS_BETTER = 'higherIsBetter';
    const LOWER_IS_BETTER = 'lowerIsBetter';

    const modeData = {
      thrpt: HIGHER_IS_BETTER,
      avgt: LOWER_IS_BETTER,
      sample: LOWER_IS_BETTER,
      ss: LOWER_IS_BETTER,
      all: LOWER_IS_BETTER,
    };

    const modesForHigherIsBetterExpectedResults = ['avgt', 'sample', 'ss', 'all'];
    const modesForHigherIsBetter = await helper(modeData, false);
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
    const testRun = {
      id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff',
      commitHash: undefined,
      branch: 'save_data',
      status: 'CREATED',
      benchmarks: 0,
      improvedVsRegressed: {},
      machine: 'core_2',
      date: 'Test run on progress',
      statistics: [
        {
          benchmark: 'benchmark.AddError.benchMarkAddError',
          forks: 5,
          jdkVersion: '1.8.0_342',
          jmhVersion: '1.35',
          jvm: '/usr/local/openjdk-8/jre/bin/java',
          jvmArgs: [],
          measurementBatchSize: 5000,
          measurementIterations: 1,
          measurementTime: 'single-shot',
          mode: 'ss',
          primaryMetric: {
            rawData: '[[0.589539949],[0.480832384],[0.713787531],[0.360920542],[0.67411422]]',
            score: 0.5638389252,
            scoreConfidence: [0.007918340042823324, 1.1197595103571767],
            scoreError: 0.5559205851571767,
            scorePercentiles: {
              '0.0': 0.360920542,
              '100.0': 0.713787531,
              '50.0': 0.589539949,
              '90.0': 0.713787531,
              '95.0': 0.713787531,
              '99.0': 0.713787531,
              99.9: 0.713787531,
              99.99: 0.713787531,
              99.999: 0.713787531,
              99.9999: 0.713787531,
            },
            scoreUnit: 's/op',
          },
          secondaryMetrics: {},
          threads: 1,
          vmName: 'OpenJDK 64-Bit Server VM',
          vmVersion: '25.342-b07',
          warmupBatchSize: 50000,
          warmupIterations: 1,
          warmupTime: 'single-shot',
        },
      ],
    };

    const testRunConvertedToMap = await convertToMap(testRun);
    const testRunConvertedToMapExpectedResult = {
      'benchmark.AddError.benchMarkAddError': {
        mode: 'ss',
        score: 0.5638389252,
      },
    };
    expect(testRunConvertedToMap).toEqual(testRunConvertedToMapExpectedResult);
  });

  test('Check sortTestRunsByMachine()', async () => {
    const sortedTestRunsByMachineExpectedResult = [
      [
        {
          id: '2c89206c-1929-11ed-861d-0242ac120002-core_2',
          commitHash: '21955383d484c2a37f49bbadefcac77f4085f45d',
          branch: 'master',
          status: 'FINISHED',
          benchmarks: 1,
          improvedVsRegressed: {
            improved: 0,
            regressed: 0,
          },
          machine: 'core_2',
          date: 'Invalid Date',
          statistics: [
            {
              benchmark: 'benchmark.AddError.benchMarkAddError',
              forks: 5,
              jdkVersion: '1.8.0_342',
              jmhVersion: '1.35',
              jvm: '/usr/local/openjdk-8/jre/bin/java',
              jvmArgs: [],
              measurementBatchSize: 5000,
              measurementIterations: 1,
              measurementTime: 'single-shot',
              mode: 'ss',
              primaryMetric: {
                rawData: '[[0.589539949],[0.480832384],[0.713787531],[0.360920542],[0.67411422]]',
                score: 0.5638389252,
                scoreConfidence: [0.007918340042823324, 1.1197595103571767],
                scoreError: 0.5559205851571767,
                scorePercentiles: {
                  '0.0': 0.360920542,
                  '100.0': 0.713787531,
                  '50.0': 0.589539949,
                  '90.0': 0.713787531,
                  '95.0': 0.713787531,
                  '99.0': 0.713787531,
                  99.9: 0.713787531,
                  99.99: 0.713787531,
                  99.999: 0.713787531,
                  99.9999: 0.713787531,
                },
                scoreUnit: 's/op',
              },
              secondaryMetrics: {},
              threads: 1,
              vmName: 'OpenJDK 64-Bit Server VM',
              vmVersion: '25.342-b07',
              warmupBatchSize: 50000,
              warmupIterations: 1,
              warmupTime: 'single-shot',
            },
          ],
        },
        {
          id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff-core_2',
          commitHash: undefined,
          branch: 'save_data',
          status: 'CREATED',
          benchmarks: 0,
          improvedVsRegressed: {},
          machine: 'core_2',
          date: 'Test run on progress',
          statistics: [],
        },
      ],
      [
        {
          id: '2c89206c-1929-11ed-861d-0242ac120002-core_32',
          commitHash: '21955383d484c2a37f49bbadefcac77f4085f45d',
          branch: 'master',
          status: 'FINISHED',
          benchmarks: 1,
          improvedVsRegressed: {
            improved: 0,
            regressed: 0,
          },
          machine: 'core_32',
          date: 'Invalid Date',
          statistics: [
            {
              benchmark: 'benchmark.AddError.benchMarkAddError',
              forks: 5,
              jdkVersion: '1.8.0_342',
              jmhVersion: '1.35',
              jvm: '/usr/local/openjdk-8/jre/bin/java',
              jvmArgs: [],
              measurementBatchSize: 5000,
              measurementIterations: 1,
              measurementTime: 'single-shot',
              mode: 'ss',
              primaryMetric: {
                rawData: '[[0.627134126],[0.553197723],[0.545472042],[0.552737187],[0.544353794]]',
                score: 0.5645789744,
                scoreConfidence: [0.4290242672938396, 0.7001336815061605],
                scoreError: 0.13555470710616047,
                scorePercentiles: {
                  '0.0': 0.544353794,
                  '100.0': 0.627134126,
                  '50.0': 0.552737187,
                  '90.0': 0.627134126,
                  '95.0': 0.627134126,
                  '99.0': 0.627134126,
                  99.9: 0.627134126,
                  99.99: 0.627134126,
                  99.999: 0.627134126,
                  99.9999: 0.627134126,
                },
                scoreUnit: 's/op',
              },
              secondaryMetrics: {},
              threads: 1,
              vmName: 'OpenJDK 64-Bit Server VM',
              vmVersion: '25.342-b07',
              warmupBatchSize: 50000,
              warmupIterations: 1,
              warmupTime: 'single-shot',
            },
          ],
        },
        {
          id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff-core_32',
          commitHash: undefined,
          branch: 'save_data',
          status: 'CREATED',
          benchmarks: 0,
          improvedVsRegressed: {},
          machine: 'core_32',
          date: 'Test run on progress',
          statistics: [],
        },
      ],
    ];
    const machines = ['core_2', 'core_32'];
    const sortedTestRunsByMachine = await sortTestRunsByMachine(machines, testRunnerTestUtils);
    expect(sortedTestRunsByMachine).toEqual(sortedTestRunsByMachineExpectedResult);
  });

  test('Check getBenchmarksByMachine()', async () => {
    const sortedTestRuns = [
      [
        {
          id: '2c89206c-1929-11ed-861d-0242ac120002-core_2',
          commitHash: '21955383d484c2a37f49bbadefcac77f4085f45d',
          branch: 'master',
          status: 'FINISHED',
          benchmarks: 1,
          improvedVsRegressed: {
            improved: 0,
            regressed: 0,
          },
          machine: 'core_2',
          date: 'Invalid Date',
          statistics: [
            {
              benchmark: 'benchmark.AddError.benchMarkAddError',
              forks: 5,
              jdkVersion: '1.8.0_342',
              jmhVersion: '1.35',
              jvm: '/usr/local/openjdk-8/jre/bin/java',
              jvmArgs: [],
              measurementBatchSize: 5000,
              measurementIterations: 1,
              measurementTime: 'single-shot',
              mode: 'ss',
              primaryMetric: {
                rawData: '[[0.589539949],[0.480832384],[0.713787531],[0.360920542],[0.67411422]]',
                score: 0.5638389252,
                scoreConfidence: [0.007918340042823324, 1.1197595103571767],
                scoreError: 0.5559205851571767,
                scorePercentiles: {
                  '0.0': 0.360920542,
                  '100.0': 0.713787531,
                  '50.0': 0.589539949,
                  '90.0': 0.713787531,
                  '95.0': 0.713787531,
                  '99.0': 0.713787531,
                  99.9: 0.713787531,
                  99.99: 0.713787531,
                  99.999: 0.713787531,
                  99.9999: 0.713787531,
                },
                scoreUnit: 's/op',
              },
              secondaryMetrics: {},
              threads: 1,
              vmName: 'OpenJDK 64-Bit Server VM',
              vmVersion: '25.342-b07',
              warmupBatchSize: 50000,
              warmupIterations: 1,
              warmupTime: 'single-shot',
            },
          ],
        },
        {
          id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff-core_2',
          commitHash: undefined,
          branch: 'save_data',
          status: 'CREATED',
          benchmarks: 0,
          improvedVsRegressed: {},
          machine: 'core_2',
          date: 'Test run on progress',
          statistics: [],
        },
      ],
      [
        {
          id: '2c89206c-1929-11ed-861d-0242ac120002-core_32',
          commitHash: '21955383d484c2a37f49bbadefcac77f4085f45d',
          branch: 'master',
          status: 'FINISHED',
          benchmarks: 1,
          improvedVsRegressed: {
            improved: 0,
            regressed: 0,
          },
          machine: 'core_32',
          date: 'Invalid Date',
          statistics: [
            {
              benchmark: 'benchmark.AddError.benchMarkAddError',
              forks: 5,
              jdkVersion: '1.8.0_342',
              jmhVersion: '1.35',
              jvm: '/usr/local/openjdk-8/jre/bin/java',
              jvmArgs: [],
              measurementBatchSize: 5000,
              measurementIterations: 1,
              measurementTime: 'single-shot',
              mode: 'ss',
              primaryMetric: {
                rawData: '[[0.627134126],[0.553197723],[0.545472042],[0.552737187],[0.544353794]]',
                score: 0.5645789744,
                scoreConfidence: [0.4290242672938396, 0.7001336815061605],
                scoreError: 0.13555470710616047,
                scorePercentiles: {
                  '0.0': 0.544353794,
                  '100.0': 0.627134126,
                  '50.0': 0.552737187,
                  '90.0': 0.627134126,
                  '95.0': 0.627134126,
                  '99.0': 0.627134126,
                  99.9: 0.627134126,
                  99.99: 0.627134126,
                  99.999: 0.627134126,
                  99.9999: 0.627134126,
                },
                scoreUnit: 's/op',
              },
              secondaryMetrics: {},
              threads: 1,
              vmName: 'OpenJDK 64-Bit Server VM',
              vmVersion: '25.342-b07',
              warmupBatchSize: 50000,
              warmupIterations: 1,
              warmupTime: 'single-shot',
            },
          ],
        },
        {
          id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff-core_32',
          commitHash: undefined,
          branch: 'master',
          status: 'CREATED',
          benchmarks: 0,
          improvedVsRegressed: {},
          machine: 'core_32',
          date: 'Test run on progress',
          statistics: [],
        },
      ],
    ];

    const benchmarksByMachineExpectedResults = [
      [
        {
          id: '2c89206c-1929-11ed-861d-0242ac120002-core_2',
          commitHash: '21955383d484c2a37f49bbadefcac77f4085f45d',
          branch: 'master',
          status: 'FINISHED',
          benchmarks: 1,
          machine: 'core_2',
          date: 'Invalid Date',
          statistics: [
            {
              benchmark: 'benchmark.AddError.benchMarkAddError',
              forks: 5,
              jdkVersion: '1.8.0_342',
              jmhVersion: '1.35',
              jvm: '/usr/local/openjdk-8/jre/bin/java',
              jvmArgs: [],
              measurementBatchSize: 5000,
              measurementIterations: 1,
              measurementTime: 'single-shot',
              mode: 'ss',
              primaryMetric: {
                rawData: '[[0.589539949],[0.480832384],[0.713787531],[0.360920542],[0.67411422]]',
                score: 0.5638389252,
                scoreConfidence: [0.007918340042823324, 1.1197595103571767],
                scoreError: 0.5559205851571767,
                scorePercentiles: {
                  '0.0': 0.360920542,
                  '100.0': 0.713787531,
                  '50.0': 0.589539949,
                  '90.0': 0.713787531,
                  '95.0': 0.713787531,
                  '99.0': 0.713787531,
                  99.9: 0.713787531,
                  99.99: 0.713787531,
                  99.999: 0.713787531,
                  99.9999: 0.713787531,
                },
                scoreUnit: 's/op',
              },
              secondaryMetrics: {},
              threads: 1,
              vmName: 'OpenJDK 64-Bit Server VM',
              vmVersion: '25.342-b07',
              warmupBatchSize: 50000,
              warmupIterations: 1,
              warmupTime: 'single-shot',
            },
          ],
          improvedVsRegressed: {
            improved: 0,
            regressed: 0,
          },
        },
        {
          id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff-core_2',
          commitHash: undefined,
          branch: 'save_data',
          status: 'CREATED',
          benchmarks: 0,
          machine: 'core_2',
          date: 'Test run on progress',
          statistics: [],
          improvedVsRegressed: {},
        },
      ],
      [
        {
          id: '2c89206c-1929-11ed-861d-0242ac120002-core_32',
          commitHash: '21955383d484c2a37f49bbadefcac77f4085f45d',
          branch: 'master',
          status: 'FINISHED',
          benchmarks: 1,
          machine: 'core_32',
          date: 'Invalid Date',
          statistics: [
            {
              benchmark: 'benchmark.AddError.benchMarkAddError',
              forks: 5,
              jdkVersion: '1.8.0_342',
              jmhVersion: '1.35',
              jvm: '/usr/local/openjdk-8/jre/bin/java',
              jvmArgs: [],
              measurementBatchSize: 5000,
              measurementIterations: 1,
              measurementTime: 'single-shot',
              mode: 'ss',
              primaryMetric: {
                rawData: '[[0.627134126],[0.553197723],[0.545472042],[0.552737187],[0.544353794]]',
                score: 0.5645789744,
                scoreConfidence: [0.4290242672938396, 0.7001336815061605],
                scoreError: 0.13555470710616047,
                scorePercentiles: {
                  '0.0': 0.544353794,
                  '100.0': 0.627134126,
                  '50.0': 0.552737187,
                  '90.0': 0.627134126,
                  '95.0': 0.627134126,
                  '99.0': 0.627134126,
                  99.9: 0.627134126,
                  99.99: 0.627134126,
                  99.999: 0.627134126,
                  99.9999: 0.627134126,
                },
                scoreUnit: 's/op',
              },
              secondaryMetrics: {},
              threads: 1,
              vmName: 'OpenJDK 64-Bit Server VM',
              vmVersion: '25.342-b07',
              warmupBatchSize: 50000,
              warmupIterations: 1,
              warmupTime: 'single-shot',
            },
          ],
          improvedVsRegressed: {
            improved: 0,
            regressed: 0,
          },
        },
        {
          id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff-core_32',
          commitHash: undefined,
          branch: 'master',
          status: 'CREATED',
          benchmarks: 0,
          machine: 'core_32',
          date: 'Test run on progress',
          statistics: [],
          improvedVsRegressed: {},
        },
      ],
    ];
    const benchmarksByMachine = await getBenchmarksByMachine(sortedTestRuns);
    expect(benchmarksByMachine).toEqual(benchmarksByMachineExpectedResults);
  });

  test('Check getBenchmarksByMachine()', async () => {
    const benchmarksByMachine = [
      [
        {
          id: '2c89206c-1929-11ed-861d-0242ac120002-core_2',
          commitHash: '21955383d484c2a37f49bbadefcac77f4085f45d',
          branch: 'master',
          status: 'FINISHED',
          benchmarks: 1,
          machine: 'core_2',
          date: 'Invalid Date',
          statistics: [
            {
              benchmark: 'benchmark.AddError.benchMarkAddError',
              forks: 5,
              jdkVersion: '1.8.0_342',
              jmhVersion: '1.35',
              jvm: '/usr/local/openjdk-8/jre/bin/java',
              jvmArgs: [],
              measurementBatchSize: 5000,
              measurementIterations: 1,
              measurementTime: 'single-shot',
              mode: 'ss',
              primaryMetric: {
                rawData: '[[0.589539949],[0.480832384],[0.713787531],[0.360920542],[0.67411422]]',
                score: 0.5638389252,
                scoreConfidence: [0.007918340042823324, 1.1197595103571767],
                scoreError: 0.5559205851571767,
                scorePercentiles: {
                  '0.0': 0.360920542,
                  '100.0': 0.713787531,
                  '50.0': 0.589539949,
                  '90.0': 0.713787531,
                  '95.0': 0.713787531,
                  '99.0': 0.713787531,
                  99.9: 0.713787531,
                  99.99: 0.713787531,
                  99.999: 0.713787531,
                  99.9999: 0.713787531,
                },
                scoreUnit: 's/op',
              },
              secondaryMetrics: {},
              threads: 1,
              vmName: 'OpenJDK 64-Bit Server VM',
              vmVersion: '25.342-b07',
              warmupBatchSize: 50000,
              warmupIterations: 1,
              warmupTime: 'single-shot',
            },
          ],
          improvedVsRegressed: {
            improved: 0,
            regressed: 0,
          },
        },
        {
          id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff-core_2',
          commitHash: undefined,
          branch: 'save_data',
          status: 'CREATED',
          benchmarks: 0,
          machine: 'core_2',
          date: 'Test run on progress',
          statistics: [],
          improvedVsRegressed: {},
        },
      ],
      [
        {
          id: '2c89206c-1929-11ed-861d-0242ac120002-core_32',
          commitHash: '21955383d484c2a37f49bbadefcac77f4085f45d',
          branch: 'master',
          status: 'FINISHED',
          benchmarks: 1,
          machine: 'core_32',
          date: 'Invalid Date',
          statistics: [
            {
              benchmark: 'benchmark.AddError.benchMarkAddError',
              forks: 5,
              jdkVersion: '1.8.0_342',
              jmhVersion: '1.35',
              jvm: '/usr/local/openjdk-8/jre/bin/java',
              jvmArgs: [],
              measurementBatchSize: 5000,
              measurementIterations: 1,
              measurementTime: 'single-shot',
              mode: 'ss',
              primaryMetric: {
                rawData: '[[0.627134126],[0.553197723],[0.545472042],[0.552737187],[0.544353794]]',
                score: 0.5645789744,
                scoreConfidence: [0.4290242672938396, 0.7001336815061605],
                scoreError: 0.13555470710616047,
                scorePercentiles: {
                  '0.0': 0.544353794,
                  '100.0': 0.627134126,
                  '50.0': 0.552737187,
                  '90.0': 0.627134126,
                  '95.0': 0.627134126,
                  '99.0': 0.627134126,
                  99.9: 0.627134126,
                  99.99: 0.627134126,
                  99.999: 0.627134126,
                  99.9999: 0.627134126,
                },
                scoreUnit: 's/op',
              },
              secondaryMetrics: {},
              threads: 1,
              vmName: 'OpenJDK 64-Bit Server VM',
              vmVersion: '25.342-b07',
              warmupBatchSize: 50000,
              warmupIterations: 1,
              warmupTime: 'single-shot',
            },
          ],
          improvedVsRegressed: {
            improved: 0,
            regressed: 0,
          },
        },
        {
          id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff-core_32',
          commitHash: undefined,
          branch: 'master',
          status: 'CREATED',
          benchmarks: 0,
          machine: 'core_32',
          date: 'Test run on progress',
          statistics: [],
          improvedVsRegressed: {},
        },
      ],
    ];

    const allBenchmarksExpectedResults = [
      {
        id: '2c89206c-1929-11ed-861d-0242ac120002-core_2',
        commitHash: '21955383d484c2a37f49bbadefcac77f4085f45d',
        branch: 'master',
        status: 'FINISHED',
        benchmarks: 1,
        machine: 'core_2',
        date: 'Invalid Date',
        statistics: [
          {
            benchmark: 'benchmark.AddError.benchMarkAddError',
            forks: 5,
            jdkVersion: '1.8.0_342',
            jmhVersion: '1.35',
            jvm: '/usr/local/openjdk-8/jre/bin/java',
            jvmArgs: [],
            measurementBatchSize: 5000,
            measurementIterations: 1,
            measurementTime: 'single-shot',
            mode: 'ss',
            primaryMetric: {
              rawData: '[[0.589539949],[0.480832384],[0.713787531],[0.360920542],[0.67411422]]',
              score: 0.5638389252,
              scoreConfidence: [0.007918340042823324, 1.1197595103571767],
              scoreError: 0.5559205851571767,
              scorePercentiles: {
                '0.0': 0.360920542,
                '100.0': 0.713787531,
                '50.0': 0.589539949,
                '90.0': 0.713787531,
                '95.0': 0.713787531,
                '99.0': 0.713787531,
                99.9: 0.713787531,
                99.99: 0.713787531,
                99.999: 0.713787531,
                99.9999: 0.713787531,
              },
              scoreUnit: 's/op',
            },
            secondaryMetrics: {},
            threads: 1,
            vmName: 'OpenJDK 64-Bit Server VM',
            vmVersion: '25.342-b07',
            warmupBatchSize: 50000,
            warmupIterations: 1,
            warmupTime: 'single-shot',
          },
        ],
        improvedVsRegressed: { improved: 0, regressed: 0 },
      },
      {
        id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff-core_2',
        commitHash: undefined,
        branch: 'save_data',
        status: 'CREATED',
        benchmarks: 0,
        machine: 'core_2',
        date: 'Test run on progress',
        statistics: [],
        improvedVsRegressed: {},
      },
      {
        id: '2c89206c-1929-11ed-861d-0242ac120002-core_32',
        commitHash: '21955383d484c2a37f49bbadefcac77f4085f45d',
        branch: 'master',
        status: 'FINISHED',
        benchmarks: 1,
        machine: 'core_32',
        date: 'Invalid Date',
        statistics: [
          {
            benchmark: 'benchmark.AddError.benchMarkAddError',
            forks: 5,
            jdkVersion: '1.8.0_342',
            jmhVersion: '1.35',
            jvm: '/usr/local/openjdk-8/jre/bin/java',
            jvmArgs: [],
            measurementBatchSize: 5000,
            measurementIterations: 1,
            measurementTime: 'single-shot',
            mode: 'ss',
            primaryMetric: {
              rawData: '[[0.627134126],[0.553197723],[0.545472042],[0.552737187],[0.544353794]]',
              score: 0.5645789744,
              scoreConfidence: [0.4290242672938396, 0.7001336815061605],
              scoreError: 0.13555470710616047,
              scorePercentiles: {
                '0.0': 0.544353794,
                '100.0': 0.627134126,
                '50.0': 0.552737187,
                '90.0': 0.627134126,
                '95.0': 0.627134126,
                '99.0': 0.627134126,
                99.9: 0.627134126,
                99.99: 0.627134126,
                99.999: 0.627134126,
                99.9999: 0.627134126,
              },
              scoreUnit: 's/op',
            },
            secondaryMetrics: {},
            threads: 1,
            vmName: 'OpenJDK 64-Bit Server VM',
            vmVersion: '25.342-b07',
            warmupBatchSize: 50000,
            warmupIterations: 1,
            warmupTime: 'single-shot',
          },
        ],
        improvedVsRegressed: { improved: 0, regressed: 0 },
      },
      {
        id: '6426ec31-b9f1-4eda-8cf6-5efd361d35ff-core_32',
        commitHash: undefined,
        branch: 'master',
        status: 'CREATED',
        benchmarks: 0,
        machine: 'core_32',
        date: 'Test run on progress',
        statistics: [],
        improvedVsRegressed: {},
      },
    ];

    const allBenchmarks = await getAllBenchmarks(benchmarksByMachine);
    expect(allBenchmarks).toEqual(allBenchmarksExpectedResults);
  });
});
