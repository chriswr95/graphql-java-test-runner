import IdCell from './IdCell';
import { render, fireEvent, waitFor, screen, getByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Router } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

describe('IdCell', () => {
  test('Renders value', () => {
    const { debug, getByText } = render(
      <BrowserRouter>
        <IdCell value={'1234566'} status={'FINISHED'} />
      </BrowserRouter>
    );
    expect(getByText('1234566')).toBeDefined();
  });

  test('Renders status icon FINISHED', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <IdCell value={'1234566'} status={'FINISHED'} />
      </BrowserRouter>
    );
    expect(getByTestId('CheckCircleOutlinedIcon')).toBeDefined();
  });

  test('Renders status icon RUNNING', () => {
    const { debug, getByTestId } = render(
      <BrowserRouter>
        <IdCell value={'1234566'} status={'FAILED'} />
      </BrowserRouter>
    );
    expect(getByTestId('HighlightOffOutlinedIcon')).toBeDefined();
  });

  test('Renders status icon FAILED', () => {
    const { debug, getByTestId } = render(
      <BrowserRouter>
        <IdCell value={'1234566'} status={'RUNNING'} />
      </BrowserRouter>
    );
    expect(getByTestId('HourglassBottomIcon')).toBeDefined();
  });

  test('Renders status icon UNDEFINED', () => {
    const { debug, getByTestId } = render(
      <BrowserRouter>
        <IdCell value={'1234566'} status={'UNDEFINED'} />
      </BrowserRouter>
    );
    expect(getByTestId('HelpOutlineIcon')).toBeDefined();
  });

  test('Renders Checkbox', async () => {
    var onChange = jest.fn();
    const { debug, getByRole } = render(
      <BrowserRouter>
        <IdCell value={'1234566'} status={'FINISHED'} hasCheckbox={true} onChange={onChange} />
      </BrowserRouter>
    );
    expect(getByRole('checkbox')).toBeDefined();
    await userEvent.click(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalled();
  });

  test('Renders checkbox state', () => {
    const { debug, getByTestId, queryByText } = render(
      <BrowserRouter>
        <IdCell value={'1234566'} status={'FINISHED'} hasCheckbox={true} />
      </BrowserRouter>
    );
    expect(getByTestId('enabledCheckbox')).toBeDefined();
    expect(queryByText('disabledCheckbox')).not.toBeInTheDocument();
  });

  test('Renders checkbox state', () => {
    const { debug, getByTestId, queryByText } = render(
      <BrowserRouter>
        <IdCell value={'1234566'} status={'FAILED'} hasCheckbox={true} />
      </BrowserRouter>
    );
    expect(getByTestId('disabledCheckbox')).toBeDefined();
    expect(queryByText('enabledCheckbox')).not.toBeInTheDocument();
  });
});
