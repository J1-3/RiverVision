import type { DashboardSnapshot } from '@/entities/dashboard/model/types';

export interface DashboardRepository {
  getSnapshot(): Promise<DashboardSnapshot>;
}
