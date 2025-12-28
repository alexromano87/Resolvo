import { AdminMaintenanceService } from './admin-maintenance.service';
export declare class AdminMaintenanceController {
    private readonly adminMaintenanceService;
    constructor(adminMaintenanceService: AdminMaintenanceService);
    getOrphanData(): Promise<import("./admin-maintenance.service").OrphanDataReport>;
    assignOrphanData(body: {
        studioId: string;
    }): Promise<{
        message: string;
        updated: any;
    }>;
}
