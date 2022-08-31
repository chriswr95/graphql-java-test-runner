import BarChart from './BarChart';
import { render, fireEvent, waitFor, screen, getByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { chartsDataAverageTime, chartsDataThroughput } from '../Assets/testRunnerTestUtils';

describe('BarChart', () => {
  test('Renders correct score/mode AverageTime', () => {
    window.ResizeObserver =
      window.ResizeObserver ||
      jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
      }));
    const { debug, getByText, queryByText } = render(<BarChart classesAndBenchmarksState={chartsDataAverageTime} />);
    expect(getByText('Average Time')).toBeDefined();
    expect(queryByText('Throughput')).not.toBeInTheDocument();
    expect(queryByText('Sample Time')).not.toBeInTheDocument();
    expect(queryByText('Single Shot Time')).not.toBeInTheDocument();
  });

  test('Renders correct score/mode Throughput', () => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    const { debug, queryByText } = render(<BarChart classesAndBenchmarksState={chartsDataThroughput} />);
    expect(queryByText('Throughput')).toBeInTheDocument();
    expect(queryByText('Average Time')).not.toBeInTheDocument();
    expect(queryByText('Sample Time')).not.toBeInTheDocument();
    expect(queryByText('Single Shot Time')).not.toBeInTheDocument();
  });
});
