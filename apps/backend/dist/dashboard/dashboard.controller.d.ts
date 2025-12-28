import { DashboardService } from './dashboard.service';
import type { CurrentUserData } from '../auth/current-user.decorator';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAdminDashboard(): Promise<import("./dashboard.service").AdminDashboardStats>;
    getStats(user: CurrentUserData, clienteId?: string): Promise<import("./dashboard.service").DashboardStats>;
    getKPI(user: CurrentUserData, clienteId?: string): Promise<import("./dashboard.service").KPI>;
    getDashboardCondivisa(clienteId: string): Promise<any>;
}
