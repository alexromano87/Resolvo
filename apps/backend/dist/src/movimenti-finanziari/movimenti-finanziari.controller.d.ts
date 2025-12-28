import { MovimentiFinanziariService } from './movimenti-finanziari.service';
import { CreateMovimentoFinanziarioDto } from './create-movimento-finanziario.dto';
import { UpdateMovimentoFinanziarioDto } from './update-movimento-finanziario.dto';
import type { CurrentUserData } from '../auth/current-user.decorator';
export declare class MovimentiFinanziariController {
    private readonly movimentiService;
    constructor(movimentiService: MovimentiFinanziariService);
    create(user: CurrentUserData, createMovimentoDto: CreateMovimentoFinanziarioDto): Promise<import("./movimento-finanziario.entity").MovimentoFinanziario>;
    findAllByPratica(user: CurrentUserData, praticaId: string): Promise<import("./movimento-finanziario.entity").MovimentoFinanziario[]>;
    getTotaliByPratica(user: CurrentUserData, praticaId: string): Promise<{
        capitale: number;
        anticipazioni: number;
        compensi: number;
        interessi: number;
        recuperoCapitale: number;
        recuperoAnticipazioni: number;
        recuperoCompensi: number;
        recuperoInteressi: number;
    }>;
    findOne(id: string): Promise<import("./movimento-finanziario.entity").MovimentoFinanziario>;
    update(id: string, updateMovimentoDto: UpdateMovimentoFinanziarioDto): Promise<import("./movimento-finanziario.entity").MovimentoFinanziario>;
    remove(id: string): Promise<void>;
}
