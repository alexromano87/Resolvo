import { Repository } from 'typeorm';
import { MovimentoFinanziario } from './movimento-finanziario.entity';
import { CreateMovimentoFinanziarioDto } from './create-movimento-finanziario.dto';
import { UpdateMovimentoFinanziarioDto } from './update-movimento-finanziario.dto';
export declare class MovimentiFinanziariService {
    private movimentiRepository;
    constructor(movimentiRepository: Repository<MovimentoFinanziario>);
    create(createMovimentoDto: CreateMovimentoFinanziarioDto): Promise<MovimentoFinanziario>;
    findAllByPratica(praticaId: string, studioId?: string): Promise<MovimentoFinanziario[]>;
    findOne(id: string): Promise<MovimentoFinanziario>;
    update(id: string, updateMovimentoDto: UpdateMovimentoFinanziarioDto): Promise<MovimentoFinanziario>;
    remove(id: string): Promise<void>;
    getTotaliByPratica(praticaId: string, studioId?: string): Promise<{
        capitale: number;
        anticipazioni: number;
        compensi: number;
        interessi: number;
        recuperoCapitale: number;
        recuperoAnticipazioni: number;
        recuperoCompensi: number;
        recuperoInteressi: number;
    }>;
}
