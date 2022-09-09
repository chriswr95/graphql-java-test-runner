import { render, fireEvent, waitFor, screen, getByRole, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { chartsDataAverageTime, chartsDataThroughput } from '../Assets/testRunnerTestUtils';
import PieChartComponent from './PieChartComponent';

describe('PieChart', () => {
  test('Renders correct score/mode AverageTime', async () => {
    const { debug, getByText, queryByText } = render(
      <PieChartComponent totalImprovedPercentage={10} totalRegressedPercentage={30} isAnimationActive={false} />
    );
    await waitFor(() => {
      expect(getByText('25%')).toBeDefined();
    });
  });
});
