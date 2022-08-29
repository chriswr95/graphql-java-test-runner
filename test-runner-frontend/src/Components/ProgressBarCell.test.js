import ProgressBarCell from './ProgressBarCell';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Experimental_CssVarsProvider } from '@mui/material';

describe('ProgressBarCell', () => {
  test('Renders improved vs regressed value', () => {
    const { getByText } = render(<ProgressBarCell improvedValue={10} regressedValue={3} />);
    expect(getByText(10)).toBeDefined();
    expect(getByText(3)).toBeDefined();
  });

  test('Renders improved vs regressed progress bar', () => {
    const { debug, getAllByRole } = render(<ProgressBarCell improvedValue={12} regressedValue={10} />);
    expect(getAllByRole('progressbar')[0]).toHaveAttribute('aria-valuenow', '54.54545454545455');
    expect(getAllByRole('progressbar')[1]).toHaveAttribute('aria-valuenow', '45.45454545454545');
  });
});
