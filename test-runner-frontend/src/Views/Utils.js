const HIGHER_IS_BETTER = 'higherIsBetter';
const LOWER_IS_BETTER = 'lowerIsBetter';

const modeData = {
  thrpt: HIGHER_IS_BETTER,
  avgt: LOWER_IS_BETTER,
  sample: LOWER_IS_BETTER,
  ss: LOWER_IS_BETTER,
  all: LOWER_IS_BETTER,
};

const calculateImprovementOrRegressionPercentage = (scoreA, scoreB) => {
  const percentage = ((scoreB - scoreA) / Math.abs(scoreA)) * 100;

  return percentage;
};

export const filterModesByHighersIsBetterOrLowerIsBetter = (modeData, isHigherBetter) => {
  const valueToFilter = isHigherBetter ? HIGHER_IS_BETTER : LOWER_IS_BETTER;
  return Object.entries(modeData)
    .filter(([key, value]) => value === valueToFilter)
    .map(([modeDataName]) => modeDataName);
};

export const getImprovedVsRegressedValues = (testRunA, testRunB) => {
  let metrics = {};

  testRunA.forEach((classAndResults) => {
    let counter = 0;
    classAndResults[1].forEach((test) => {
      counter += test.benchmarkScore;
    });
    metrics[classAndResults[0]] = {
      firstResult: counter,
      secondResult: 0,
      mode: classAndResults[1][0].mode,
      improvementOrRegressionPercentage: null,
      didImprove: undefined,
      benchmarks: classAndResults[1].length,
      isClassOnBothTestRuns: false,
    };
  });

  testRunB.forEach((classAndResults) => {
    let counter = 0;
    classAndResults[1].forEach((test) => {
      counter += test.benchmarkScore;
    });
    if (metrics[classAndResults[0]]) {
      metrics[classAndResults[0]].isClassOnBothTestRuns = true;
      metrics[classAndResults[0]].secondResult = counter;
      const results = calculateImprovementOrRegressionPercentage(
        metrics[classAndResults[0]].firstResult,
        metrics[classAndResults[0]].secondResult
      );
      metrics[classAndResults[0]].improvementOrRegressionPercentage = results;

      const modesWhereLowerIsBetter = filterModesByHighersIsBetterOrLowerIsBetter(modeData, false);
      const modesWhereHigherIsBetter = filterModesByHighersIsBetterOrLowerIsBetter(modeData, true);

      if (modesWhereHigherIsBetter.includes(metrics[classAndResults[0]].mode))
        metrics[classAndResults[0]].didImprove = results > 0;
      else if (modesWhereLowerIsBetter.includes(metrics[classAndResults[0]].mode))
        metrics[classAndResults[0]].didImprove = results < 0;
    }
  });

  const improvedClasses = Object.entries(metrics).filter((metric) => {
    metric[1].improvementOrRegressionPercentage = Math.abs(metric[1].improvementOrRegressionPercentage);
    return metric[1].didImprove && metric[1].isClassOnBothTestRuns;
  });
  const regressedClasses = Object.entries(metrics).filter((metric) => {
    metric[1].improvementOrRegressionPercentage = Math.abs(metric[1].improvementOrRegressionPercentage);
    return !metric[1].didImprove && metric[1].isClassOnBothTestRuns;
  });

  let totalImprovedPercentage = improvedClasses.length;
  let totalRegressedPercentage = regressedClasses.length;

  return {
    improvedClasses,
    regressedClasses,
    totalImprovedPercentage,
    totalRegressedPercentage,
  };
};

export const combineChartsData = (testRunA, testRunB) => {
  var classesArray = [];
  testRunA.forEach((testRun) => {
    testRun[1].forEach((test) => {
      test.benchmarkMethod = test.benchmarkMethod + ' - Test Run 1';
    });
    classesArray[testRun[0]] ??= [];
    classesArray[testRun[0]]?.push(testRun[1]);
  });
  testRunB.forEach((testRun) => {
    testRun[1].forEach((test) => {
      test.benchmarkMethod = test.benchmarkMethod + ' - Test Run 2';
    });
    classesArray[testRun[0]] ??= [];
    if (!classesArray[testRun[0]][0]?.length) classesArray[testRun[0]]?.push(testRun[1]);
    else {
      classesArray[testRun[0]]?.push(
        (classesArray[testRun[0]][0].length > testRun[1].length ? classesArray[testRun[0]][0] : testRun[1])
          .map((_, i) => [classesArray[testRun[0]][0][i], testRun[1][i]])
          .flat()
          .filter(Boolean)
      );
    }
  });
  const mappedClasses = Object.entries(classesArray).filter((currentClass) => currentClass[1][1]?.length > 1);

  return mappedClasses;
};

export const buildChartsData = (selectedTestRunFromDashboard) => {
  const classesAndBenchmarks = {};
  selectedTestRunFromDashboard?.statistics?.forEach((testRun, index) => {
    // Benchmark example string: "benchmark": "benchmark.ListBenchmark.benchmarkArrayList"
    var benchmarkCassAndMethod = testRun.benchmark.split('.');
    var benchmarkClassWithMode = benchmarkCassAndMethod[1] + '-' + testRun.mode;
    var benchmarkClass = benchmarkCassAndMethod[1];
    var benchmarkMethod = benchmarkCassAndMethod[2];
    var benchmarkData = {
      jobId: selectedTestRunFromDashboard?.id,
      benchmarkClass: benchmarkClass,
      benchmarkMethod: benchmarkMethod,
      benchmarkScore: testRun.primaryMetric.score,
      benchmarkError: testRun.primaryMetric.scoreError,
      mode: testRun.mode,
      json: testRun,
    };
    classesAndBenchmarks[benchmarkClassWithMode] ??= [];
    classesAndBenchmarks[benchmarkClassWithMode]?.push(benchmarkData);
  });

  var allClassesAndBenchmarks = [];

  Object.entries(classesAndBenchmarks).forEach(([key, value]) => {
    const uniqueIds = new Set();
    const unique = value.filter((element) => {
      const isDuplicate = uniqueIds.has(element.benchmarkMethod);
      uniqueIds.add(element.benchmarkMethod);
      if (!isDuplicate) {
        return true;
      }
      return false;
    });
    allClassesAndBenchmarks[key] = unique;
  });

  var sortedByClassNameClassesAndBenchmarks = Object.entries(allClassesAndBenchmarks).sort();
  return sortedByClassNameClassesAndBenchmarks;
};

export const buildIndividualJsonResults = (benchmarks) => {
  const jobId = benchmarks[0].jobId;
  const className = benchmarks[0].benchmarkClass;
  const jsonResults = benchmarks.map((benchmark) => benchmark.json);

  return {
    jobId,
    className,
    jsonResults,
  };
};

export const buildIndividualJsonResultsCompare = (benchmarks) => {
  const jobIdA = benchmarks[0].jobId;
  const jobIdB = benchmarks[1].jobId;
  const className = benchmarks[0].benchmarkClass;
  const jsonResults = benchmarks.map((benchmark) => benchmark.json);

  return {
    jobIdA,
    jobIdB,
    className,
    jsonResults,
  };
};

export const buildJsonResults = (benchmarks) => {
  const jobId = benchmarks[0][1][0].jobId;
  const jsonResults = benchmarks.map((benchmark) => {
    return benchmark[1].map((jsonRes) => jsonRes.json);
  });

  return {
    jobId,
    className: '',
    jsonResults,
  };
};

export const downloadJSON = (jsonBnechmark, jobId, jsonData) => {
  const fileData = JSON.stringify(jsonData);
  const blob = new Blob([fileData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = jsonBnechmark ? `${jsonBnechmark}-${jobId}.json` : `Test-run-${jobId}.json`;
  link.href = url;
  link.click();
  return link;
};
