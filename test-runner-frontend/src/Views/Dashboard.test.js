import Dashboard from './Dashboard';
import { render, fireEvent, waitFor, screen, getByRole, queryHelpers, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


describe('Dashboard', () => {
  test('Check buttons rendering and functionality', async () => {
    var handleChangeMachineSelection = jest.fn();
    const { debug, getByText, getByRole, container } = render(<Dashboard/>);
    const CompareButton = screen.getByRole('button', { name: /Compare/i });
    expect(CompareButton).toBeDefined();
    await userEvent.click(CompareButton);
    const CancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(CancelButton).toBeDefined();
    await userEvent.click(CancelButton);
    const AllTestRunsButton = screen.getByRole('button', { name: /All Test Runs/i });
    expect(AllTestRunsButton).toBeDefined();
    await userEvent.click(AllTestRunsButton);
    expect(getByText("Master Only")).toBeInTheDocument();
    const RenamedButton = screen.getByRole('option', { name: /Master Only/i });
    await userEvent.click(RenamedButton);
    expect(getByRole('button', { name: /Master Only/i })).toBeDefined();
  });

});
