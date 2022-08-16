import TestRunsTable from './TestRunsTable';
import { render, fireEvent, waitFor, screen, getByRole, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


describe('Test Runs Table', () => {
    var testRunResults = [{
        id: 'a1224f86-1981-11ed-861d-0242ac120002',
        branch: 'master',
        status: 'FAILED',
        benchmarks: 10,
        improvedVsRegressed: {
            improved: 5,
            regressed: 5,
        },
        machine: 'e2-standard-2',
        date: '12/08/2022 9:12 pm',
    },
    {
        id: 'af2ac950-1981-11ed-861d-0242ac120002',
        branch: 'add_error_logs',
        status: 'FAILED',
        benchmarks: 7,
        improvedVsRegressed: {
            improved: 4,
            regressed: 3,
        },
        machine: 'e2-standard-32',
        date: '12/08/2022 10:42 pm',
    }]

    test('Renders tests', () => {
        const { debug, getByText, getAllByRole, getByTestId } = render(<TestRunsTable testRunResults={testRunResults} />);
        expect(getByText('a1224f86-1981-11ed-861d-0242ac120002')).toBeDefined();
        expect(getAllByRole('cell', { name: /master/i })).toBeDefined();
        expect(getAllByRole('cell', { name: /af2ac950-1981-11ed-861d-0242ac120002/i })).toBeDefined();
        expect(getAllByRole('columnheader', { name: /Date/i })).toBeDefined();
        expect(getByTestId('ArrowDownwardIcon')).toBeDefined();
        console.log(debug());
    });

    test('Renders tests on the table', () => {
        const { debug, getAllByRole } = render(<TestRunsTable testRunResults={testRunResults} />);
        expect(getAllByRole('button', { name: /Rows per page: 10/i })).toBeDefined();
        expect(getAllByRole('button', { name: /Go to previous page/i })).toBeDefined();
        expect(getAllByRole('button', { name: /Go to next page/i })).toBeDefined();
    });

    test('Renders tests on the table', () => {
        const { debug, getAllByRole } = render(<TestRunsTable testRunResults={testRunResults} />);
        expect(getAllByRole('button', { name: /Rows per page: 10/i })).toBeDefined();
        expect(getAllByRole('button', { name: /Go to previous page/i })).toBeDefined();
        expect(getAllByRole('button', { name: /Go to next page/i })).toBeDefined();
    });

    test('Renders sortDate', async () => {
        var sortDate = jest.fn();
        const { debug, getByTestId, getAllByRole } = render(<TestRunsTable testRunResults={testRunResults} sortDate={sortDate} />);
        const SortButton = screen.getByTestId('iconButton');
        await userEvent.click(SortButton);
        expect(sortDate).toHaveBeenCalled();
    });


    test('Renders checkboxActive', async () => {
        var updateSelectedTestRunsToCompare = jest.fn();
        const { debug, getByRole } = render(<TestRunsTable updateSelectedTestRunsToCompare={updateSelectedTestRunsToCompare} testRunResults={testRunResults} isCheckBoxActive={true} />);
        const checkbox1 = screen.getByRole('checkbox', {name: /a1224f86-1981-11ed-861d-0242ac120002 5 500 500 5 10 master e2-standard-2 12\/08\/2022 9:12 pm/i });
        const checkbox2 = screen.getByRole('checkbox', {name: /af2ac950-1981-11ed-861d-0242ac120002 4 400 300 3 7 add_error_logs e2-standard-32 12\/08\/2022 10:42 pm/i });
        await userEvent.click(checkbox1);
        await userEvent.click(checkbox2);
        expect(checkbox1).toBeDefined();
        expect(checkbox2).toBeDefined();
        });
    });
