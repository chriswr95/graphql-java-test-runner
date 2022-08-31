import Dashboard from './Dashboard';
import { render, fireEvent, waitFor, screen, getByRole, queryHelpers, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import React from 'react';
import { FirestoreContext } from '../Components/FirestoreProvider';
import { firestoreDataArray } from '../Assets/testRunnerTestUtils';
import { BrowserRouter } from 'react-router-dom';

describe('Dashboard', () => {
  const state = {
    loading: false,
    firestoreData: firestoreDataArray,
    machines: ['core_32', 'core_2'],
  };

  test('Check dropwdown menu All Test Runs', async () => {
    const { debug, getByRole, getAllByText, queryByText } = render(
      <BrowserRouter>
        <FirestoreContext.Provider value={state}>
          <Dashboard />
        </FirestoreContext.Provider>
      </BrowserRouter>
    );
    expect(getAllByText('master')).toBeDefined();
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
  });

  test('Check dropdown menu All Machines', async () => {
    const { debug, getByRole, getAllByText, queryByText } = render(
      <BrowserRouter>
        <FirestoreContext.Provider value={state}>
          <Dashboard />
        </FirestoreContext.Provider>
      </BrowserRouter>
    );
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
