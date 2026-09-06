import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardPage } from './DashboardPage';

vi.mock('../services/api', () => ({
  getHealth: vi.fn().mockResolvedValue({ status: 'ok', service: 'bchealth-api', timestamp: new Date().toISOString() }),
}));

describe('DashboardPage', () => {
  it('renders clinic dashboard cards', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <DashboardPage />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Clinic Dashboard')).toBeInTheDocument();
    expect(screen.getByText("Today's visits")).toBeInTheDocument();
    expect(screen.getByText('Low-stock medicines')).toBeInTheDocument();
  });
});
