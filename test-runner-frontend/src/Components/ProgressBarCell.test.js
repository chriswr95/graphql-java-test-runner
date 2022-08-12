import ProgressBarCell from './ProgressBarCell';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Experimental_CssVarsProvider } from '@mui/material';

describe('ProgressBarCell', () => {
  test('Renders improved vs regressed value', () => {
    const { debug, getByText } = render(<ProgressBarCell improvedValue={10} regressedValue={2} />);
    expect(getByText(10)).toBeDefined();
    expect(getByText(2)).toBeDefined();
  });

  test('Renders improved vs regressed progress bar', () => {
    const { debug, getAllByRole } = render(<ProgressBarCell improvedValue={10} regressedValue={2} />);
    expect(getAllByRole('progressbar')[0]).toHaveAttribute('aria-valuenow', '1000');
    expect(getAllByRole('progressbar')[1]).toHaveAttribute('aria-valuenow', '200');
  });
});
