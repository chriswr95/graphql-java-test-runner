import ProgressBarCell from './ProgressBarCell';
import { render } from '@testing-library/react';

describe('ProgressBarCell', () => {
  test('Renders improved vs regressed value', () => {
    const { getByText } = render(<ProgressBarCell improvedValue={10} regressedValue={3} totalBenchmarks={13} />);
    expect(getByText(10)).toBeDefined();
    expect(getByText(3)).toBeDefined();
  });

  test('Renders improved vs regressed progress bar', () => {
    const { debug, getAllByRole } = render(
      <ProgressBarCell improvedValue={12} regressedValue={10} totalBenchmarks={30} />
    );
    expect(getAllByRole('progressbar')[0]).toHaveAttribute('aria-valuenow', '40');
    expect(getAllByRole('progressbar')[1]).toHaveAttribute('aria-valuenow', '33.333333333333336');
  });
});
