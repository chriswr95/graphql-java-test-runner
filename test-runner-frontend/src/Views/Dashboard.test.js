import Dashboard from './Dashboard';
import { render, fireEvent, waitFor, screen, getByRole, queryHelpers, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Dashboard', () => {
  test('Check dropwdown menu All Test Runs', async () => {
    const { debug, getByRole, getAllByText, queryByText } = render(<Dashboard />);
    const AllTestRunsButton = getByRole('button', { name: /All Test Runs/i });
    await userEvent.click(AllTestRunsButton);
    const MasterOnlyOption = getByRole('option', { name: /Master Only/i });
    await userEvent.click(MasterOnlyOption);
    expect(queryByText('save_data')).not.toBeInTheDocument();
    const MasterOnlyButton = getByRole('button', { name: /Master Only/i });
    await userEvent.click(MasterOnlyButton);
    const AllTestRunsOption = getByRole('option', { name: /All Test Runs/i });
    await userEvent.click(AllTestRunsOption);
  });

  test('Check dropdown menu All Machines', async () => {
    const { debug, getByRole, getAllByText, queryByText } = render(<Dashboard />);
    const AllMachinesButton = getByRole('button', { name: /All Machines/i });
    await userEvent.click(AllMachinesButton);
    const e2Standard32Option = getByRole('option', { name: /core_32/i });
    await userEvent.click(e2Standard32Option);
    expect(getAllByText('core_32')).toBeDefined();
    const e2Standard32Button = getByRole('button', { name: /core_32/i });
    await userEvent.click(e2Standard32Button);
    const e2Standard2Option = getByRole('option', { name: /core_2/i });
    await userEvent.click(e2Standard2Option);
    expect(getAllByText('core_2')).toBeDefined();
  });
});
