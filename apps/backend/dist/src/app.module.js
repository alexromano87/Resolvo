"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const clienti_module_1 = require("./clienti/clienti.module");
const debitori_module_1 = require("./debitori/debitori.module");
const clienti_debitori_module_1 = require("./relazioni/clienti-debitori.module");
const fasi_module_1 = require("./fasi/fasi.module");
const pratiche_module_1 = require("./pratiche/pratiche.module");
const avvocati_module_1 = require("./avvocati/avvocati.module");
const movimenti_finanziari_module_1 = require("./movimenti-finanziari/movimenti-finanziari.module");
const alerts_module_1 = require("./alerts/alerts.module");
const tickets_module_1 = require("./tickets/tickets.module");
const documenti_module_1 = require("./documenti/documenti.module");
const cartelle_module_1 = require("./cartelle/cartelle.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const studi_module_1 = require("./studi/studi.module");
const admin_maintenance_module_1 = require("./admin/admin-maintenance.module");
const audit_log_module_1 = require("./audit/audit-log.module");
const export_module_1 = require("./export/export.module");
const import_module_1 = require("./import/import.module");
const notifications_module_1 = require("./notifications/notifications.module");
const core_1 = require("@nestjs/core");
const rate_limit_guard_1 = require("./common/rate-limit.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    if (configService.get('DB_USE_SQLITE') === 'true') {
                        return {
                            type: 'sqlite',
                            database: ':memory:',
                            autoLoadEntities: true,
                            synchronize: true,
                        };
                    }
                    return {
                        type: 'mysql',
                        host: configService.get('DB_HOST', 'localhost'),
                        port: configService.get('DB_PORT', 3307),
                        username: configService.get('DB_USERNAME', 'rc_user'),
                        password: configService.get('DB_PASSWORD', 'rc_pass'),
                        database: configService.get('DB_DATABASE', 'recupero_crediti'),
                        autoLoadEntities: true,
                        synchronize: configService.get('NODE_ENV') !== 'production',
                    };
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            studi_module_1.StudiModule,
            clienti_module_1.ClientiModule,
            debitori_module_1.DebitoriModule,
            clienti_debitori_module_1.ClientiDebitoriModule,
            fasi_module_1.FasiModule,
            pratiche_module_1.PraticheModule,
            avvocati_module_1.AvvocatiModule,
            movimenti_finanziari_module_1.MovimentiFinanziariModule,
            alerts_module_1.AlertsModule,
            tickets_module_1.TicketsModule,
            documenti_module_1.DocumentiModule,
            cartelle_module_1.CartelleModule,
            dashboard_module_1.DashboardModule,
            admin_maintenance_module_1.AdminMaintenanceModule,
            audit_log_module_1.AuditLogModule,
            notifications_module_1.NotificationsModule,
            export_module_1.ExportModule,
            import_module_1.ImportModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: rate_limit_guard_1.RateLimitGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map