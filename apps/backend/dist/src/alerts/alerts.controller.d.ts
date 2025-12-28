import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AddMessaggioDto } from './dto/add-messaggio.dto';
import type { CurrentUserData } from '../auth/current-user.decorator';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    create(user: CurrentUserData, createAlertDto: CreateAlertDto): Promise<import("./alert.entity").Alert>;
    findAll(user: CurrentUserData, includeInactive?: boolean, page?: string, limit?: string): Promise<import("./alert.entity").Alert[]>;
    findAllByPratica(user: CurrentUserData, praticaId: string, includeInactive?: boolean, page?: string, limit?: string): Promise<import("./alert.entity").Alert[]>;
    findAllByStato(user: CurrentUserData, stato: 'in_gestione' | 'chiuso', includeInactive?: boolean, page?: string, limit?: string): Promise<import("./alert.entity").Alert[]>;
    findOne(user: CurrentUserData, id: string): Promise<import("./alert.entity").Alert>;
    update(user: CurrentUserData, id: string, updateAlertDto: UpdateAlertDto): Promise<import("./alert.entity").Alert>;
    deactivate(user: CurrentUserData, id: string): Promise<import("./alert.entity").Alert>;
    reactivate(user: CurrentUserData, id: string): Promise<import("./alert.entity").Alert>;
    remove(user: CurrentUserData, id: string): Promise<void>;
    addMessaggio(user: CurrentUserData, id: string, addMessaggioDto: AddMessaggioDto): Promise<import("./alert.entity").Alert>;
    chiudiAlert(user: CurrentUserData, id: string): Promise<import("./alert.entity").Alert>;
    riapriAlert(user: CurrentUserData, id: string): Promise<import("./alert.entity").Alert>;
}
