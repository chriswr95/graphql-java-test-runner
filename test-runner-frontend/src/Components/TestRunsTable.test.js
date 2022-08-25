import TestRunsTable from './TestRunsTable';
import { render, fireEvent, waitFor, screen, getByRole, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import crypto from 'node:crypto';
import { BrowserRouter } from 'react-router-dom';

const generateMockData = () => {
  var branchArray = ['master', 'add_error_logs', 'save_data'];

  var statusArray = ['FAILED', 'FINISHED'];

  var machinesArray = ['e2-standard-2', 'e2-standard-32'];

  var testRunResult = {
    id: crypto.randomUUID(),
    branch: branchArray[Math.floor(Math.random() * branchArray.length)],
    status: statusArray[Math.floor(Math.random() * statusArray.length)],
    benchmarks: 11,
    improvedVsRegressed: {
      improved: 9,
      regressed: 2,
    },
    machine: machinesArray[Math.floor(Math.random() * machinesArray.length)],
    date: '12/08/2022 4:35 pm',
  };

  return testRunResult;
};

const generateMockDataCaller = (times) => {
  var testRunsResults = [];

  for (var i = 0; i < times; i++) {
    testRunsResults.push(generateMockData());
  }

  return testRunsResults;
};

describe('Test Runs Table', () => {
  test('Renders tests', () => {
    var testRunResults = generateMockDataCaller(25);
    const { debug, getByText, getAllByRole, getByTestId } = render(
      <BrowserRouter>
        <TestRunsTable testRunResults={testRunResults} />
      </BrowserRouter>
    );
    expect(getByText(testRunResults[0].id)).toBeDefined();
    expect(getAllByRole('cell', { name: testRunResults[0].branch })).toBeDefined();
    expect(getAllByRole('cell', { name: testRunResults[0].id })).toBeDefined();
    expect(getAllByRole('columnheader', { name: /Date/i })).toBeDefined();
    expect(getByTestId('ArrowDownwardIcon')).toBeDefined();
  });

  test('Renders row per page', async () => {
    var testRunResults = generateMockDataCaller(25);
    const { debug, getByRole, getAllByTestId } = render(
      <BrowserRouter>
        <TestRunsTable testRunResults={testRunResults} />
      </BrowserRouter>
    );
    expect(getAllByTestId('testRunsTableBodyRow')).toHaveLength(10);
    const RowsPerPage = getByRole('button', { name: /Rows per page: 10/i });
    await userEvent.click(RowsPerPage);
    const Option = getByRole('option', { name: /5/i });
    await userEvent.click(Option);
    expect(getAllByTestId('testRunsTableBodyRow')).toHaveLength(5);
  });

  test('Pagination', async () => {
    var testRunResults = generateMockDataCaller(25);
    const { debug, getByRole, getAllByTestId, getByText } = render(
      <BrowserRouter>
        <TestRunsTable testRunResults={testRunResults} />
      </BrowserRouter>
    );
    expect(getAllByTestId('testRunsTableBodyRow')).toHaveLength(10);
    const NextPage = getByRole('button', { name: /Go to next page/i });
    for (var i = 0; i < 10; i++) {
      expect(getByText(testRunResults[i].id)).toBeDefined();
    }
    await userEvent.click(NextPage);
    for (var i = 10; i < 20; i++) {
      expect(getByText(testRunResults[i].id)).toBeDefined();
    }
    await userEvent.click(NextPage);
    for (var i = 20; i < 25; i++) {
      expect(getByText(testRunResults[i].id)).toBeDefined();
    }
  });

  test('Renders sortTests', async () => {
    var testRunResults = generateMockDataCaller(25);
    var sortTests = jest.fn();
    const { debug, getByTestId } = render(
      <BrowserRouter>
        <TestRunsTable testRunResults={testRunResults} sortTests={sortTests} />
      </BrowserRouter>
    );
    const SortButton = screen.getByTestId('iconButton');
    await userEvent.click(SortButton);
    expect(sortTests).toHaveBeenCalled();
  });

  test('Renders checkboxActive', async () => {
    var onCheckboxChange = jest.fn();
    var testRunResults = [
      {
        id: crypto.randomUUID(),
        branch: 'master',
        status: 'FINISHED',
        benchmarks: 11,
        improvedVsRegressed: {
          improved: 9,
          regressed: 2,
        },
        machine: 'core_32',
        date: '12/08/2022 4:35 pm',
      },
    ];
    const { debug, getAllByRole } = render(
      <BrowserRouter>
        {' '}
        <TestRunsTable onCheckboxChange={onCheckboxChange} testRunResults={testRunResults} isCheckBoxActive={true} />
      </BrowserRouter>
    );
    const checkbox1 = getAllByRole('checkbox')[1];
    await userEvent.click(checkbox1);
    expect(onCheckboxChange).toHaveBeenCalledWith(testRunResults[0]);
  });
});
