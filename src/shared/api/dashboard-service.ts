import { getNextDashboardSnapshot } from '@/shared/mock/realtime-dashboard-simulator';
import type { DashboardRepository } from './types';

const useMock = true;

class MockDashboardRepository implements DashboardRepository {
  async getSnapshot() {
    return getNextDashboardSnapshot();
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
