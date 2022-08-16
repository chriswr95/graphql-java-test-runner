import IdCell from './IdCell';
import { render, fireEvent, waitFor, screen, getByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('IdCell', () => {
  test('Renders value', () => {
    const { debug, getByText } = render(<IdCell value={'1234566'} status={'FINISHED'} />);
    expect(getByText('1234566')).toBeDefined();
  });

  test('Renders status icon FINISHED', () => {
    const { getByTestId } = render(<IdCell value={'1234566'} status={'FINISHED'} />);
    expect(getByTestId('CheckCircleOutlinedIcon')).toBeDefined();
  });

  test('Renders status icon RUNNING', () => {
    const { debug, getByTestId } = render(<IdCell value={'1234566'} status={'FAILED'} />);
    expect(getByTestId('HighlightOffOutlinedIcon')).toBeDefined();
  });

  test('Renders status icon FAILED', () => {
    const { debug, getByTestId } = render(<IdCell value={'1234566'} status={'RUNNING'} />);
    expect(getByTestId('HourglassBottomIcon')).toBeDefined();
  });

  test('Renders status icon UNDEFINED', () => {
    const { debug, getByTestId } = render(<IdCell value={'1234566'} status={'UNDEFINED'} />);
    expect(getByTestId('HelpOutlineIcon')).toBeDefined();
  });

  test('Renders Checkbox', async () => {
    var onChange = jest.fn();
    const { debug, getByRole } = render(
      <IdCell value={'1234566'} status={'UNDEFINED'} hasCheckbox={true} onChange={onChange} />
    );
    expect(getByRole('checkbox')).toBeDefined();
    await userEvent.click(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalled();
  });
});
