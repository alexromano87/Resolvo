import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Pratica } from '../pratiche/pratica.entity';
import { Cliente } from '../clienti/cliente.entity';
import { Studio } from '../studi/studio.entity';
import { User } from '../users/user.entity';
import { Debitore } from '../debitori/debitore.entity';
import { Avvocato } from '../avvocati/avvocato.entity';
import { Documento } from '../documenti/documento.entity';
import { MovimentoFinanziario } from '../movimenti-finanziari/movimento-finanziario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pratica,
      Cliente,
      Studio,
      User,
      Debitore,
      Avvocato,
      Documento,
      MovimentoFinanziario,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
