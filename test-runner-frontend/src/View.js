import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import Compare from './Views/Compare';
import Dashboard from './Views/Dashboard';
import Report from './Views/Report';

export default function View() {
  let [searchParams] = useSearchParams();

  const hasReportParams = searchParams.get('report');
  const hasCompareParamsA = searchParams.get('compareA');
  const hasCompareParamsB = searchParams.get('compareB');

  //Dashboard
  //https://adarsh-jaiswal.github.io/graphql-java-test-runner/

  //Report View
  //https://adarsh-jaiswal.github.io/graphql-java-test-runner/?report=1234131413

  //Compare View
  //https://adarsh-jaiswal.github.io/graphql-java-test-runner/?compareA=123214&compareB=123467

  if (hasReportParams) return <Report />;
  else if (hasCompareParamsA && hasCompareParamsB) return <Compare />;
  else return <Dashboard />;
}