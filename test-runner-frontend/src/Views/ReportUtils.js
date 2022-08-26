import html2canvas from 'html2canvas';
import jsPdf from 'jspdf';

export const builChartsData = (from) => {
  const classesAndBenchmarks = {};
  from?.statistics?.map((testRun, index) => {
    var benchmarkCassAndMethod = testRun.benchmark.split('.');
    var benchmarkClass = benchmarkCassAndMethod[1] + '-' + testRun.mode;
    var benchmarkMethod = benchmarkCassAndMethod[2];
    var benchmarkData = {
      jobId: from?.id,
      benchmarkClass: benchmarkClass,
      benchmarkMethod: benchmarkMethod,
      benchmarkScore: testRun.primaryMetric.score,
      benchmarkError: testRun.primaryMetric.scoreError,
      mode: testRun.mode,
      json: testRun,
    };
    classesAndBenchmarks[benchmarkClass] ??= [];
    classesAndBenchmarks[benchmarkClass]?.push(benchmarkData);
    return classesAndBenchmarks;
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
  var sortedByClassNameClassesAndBenchmarks = Object.keys(allClassesAndBenchmarks)
    ?.sort()
    ?.reduce(
      (acc, key) => ({
        ...acc,
        [key]: allClassesAndBenchmarks[key],
      }),
      {}
    );

  return sortedByClassNameClassesAndBenchmarks;
};

export const buildJsonResults = (benchmarks) => {
  const jobId = benchmarks[0].jobId;
  const className = benchmarks[0].benchmarkClass;
  const jsonResults = [];
  benchmarks.map((benchmark) => jsonResults.push(benchmark.json));

  return {
    jobId,
    className,
    jsonResults,
  };
};

export const printPDF = () => {
  const domElement = document.getElementById('root');
  html2canvas(domElement, {
    onclone: (document) => {
      document.getElementById('print').style.visibility = 'hidden';
    },
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPdf();
    pdf.addImage(imgData, 'PNG', 0, 0, 200, 200);
    pdf.save(`${new Date().toISOString()}.pdf`);
  });
};

export const downloadJSON = (jsonBnechmark, jobId, jsonData) => {
  const fileData = JSON.stringify(jsonData);
  const blob = new Blob([fileData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${jsonBnechmark}-${jobId}.json`;
  link.href = url;
  link.click();
};
