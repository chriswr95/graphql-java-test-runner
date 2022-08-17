import Dashboard from './Dashboard';
import { render, fireEvent, waitFor, screen, getByRole, queryHelpers, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Dashboard', () => {
    /*
  test('Check buttons rendering and functionality', async () => {
    const { debug, getByRole } = render(<Dashboard/>);
    const CompareButton = getByRole('button', { name: /Compare/i });
    expect(CompareButton).toBeDefined();
    await userEvent.click(CompareButton);
    const CancelButton = getByRole('button', { name: /Cancel/i });
    expect(CancelButton).toBeDefined();
    await userEvent.click(CancelButton);
  });
  */

  test('Check dropwdown menu All Test Runs', async () => {
    const { debug, getByRole, getAllByText, queryByText } = render(<Dashboard/>);
    expect(getAllByText('master')).toBeDefined();
    expect(getAllByText('save_data')).toBeDefined();
    const AllTestRunsButton = getByRole('button', { name: /All Test Runs/i });
    await userEvent.click(AllTestRunsButton);
    const MasterOnlyOption = getByRole('option', { name: /Master Only/i });
    await userEvent.click(MasterOnlyOption);
    expect(getAllByText('master')).toBeDefined();
    expect(queryByText('save_data')).not.toBeInTheDocument();
    const MasterOnlyButton = getByRole('button', { name: /Master Only/i });
    await userEvent.click(MasterOnlyButton);
    const AllTestRunsOption = getByRole('option', { name: /All Test Runs/i });
    await userEvent.click(AllTestRunsOption);
    expect(getAllByText('master')).toBeDefined();
    expect(getAllByText('save_data')).toBeDefined();
  });

  
  test('Check dropdown menu All Machines', async () => {
    const { debug, getByRole, getAllByText } = render(<Dashboard/>);
    expect(getAllByText('e2-standard-32')).toBeDefined();
    expect(getAllByText('e2-standard-2')).toBeDefined();
    const AllMachinesButton = getByRole('button', { name: /All Machines/i });
    await userEvent.click(AllMachinesButton);
    const e2Standard32Option = getByRole('option', { name: /e2-standard-32/i });
    await userEvent.click(e2Standard32Option);
    expect(getAllByText('e2-standard-32')).toBeDefined();
    const e2Standard32Button = getByRole('button', { name: /e2-standard-32/i });
    await userEvent.click(e2Standard32Button);
    const e2Standard2Option = getByRole('option', { name: /e2-standard-2/i });
    await userEvent.click(e2Standard2Option);
    expect(getAllByText('e2-standard-2')).toBeDefined();
  });
  
});
