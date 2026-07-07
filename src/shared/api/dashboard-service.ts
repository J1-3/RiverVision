import { dashboardMock } from '@/shared/mock/dashboard-data';
import type { DashboardRepository } from './types';

const useMock = true;

class MockDashboardRepository implements DashboardRepository {
  async getSnapshot() {
    return Promise.resolve(dashboardMock);
  }
}

class HttpDashboardRepository implements DashboardRepository {
  async getSnapshot() {
    const response = await fetch('/api/dashboard');
    if (!response.ok) {
      throw new Error(`Failed to load dashboard snapshot: ${response.status}`);
    }

    return response.json();
  }
}

export const dashboardRepository: DashboardRepository = useMock
  ? new MockDashboardRepository()
  : new HttpDashboardRepository();
