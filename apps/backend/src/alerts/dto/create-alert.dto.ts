// apps/backend/src/alerts/dto/create-alert.dto.ts
import { IsString, IsUUID, IsEnum, IsDateString, IsInt, Min, IsNotEmpty, IsOptional } from 'class-validator';
import type { AlertDestinatario, AlertModalitaNotifica } from '../alert.entity';
import { NoSpecialChars } from '../../common/validators/no-special-chars.decorator';

export class CreateAlertDto {
  @IsOptional()
  @IsUUID()
  studioId?: string | null;

  @IsUUID()
  @IsNotEmpty()
  praticaId: string;

  @IsString()
  @IsNotEmpty()
  @NoSpecialChars()
  titolo: string;

  @IsString()
  @IsNotEmpty()
  @NoSpecialChars()
  descrizione: string;

  @IsEnum(['studio', 'cliente'])
  destinatario: AlertDestinatario;

  @IsEnum(['popup'])
  @IsOptional()
  modalitaNotifica?: AlertModalitaNotifica;

  @IsDateString()
  dataScadenza: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  giorniAnticipo?: number;
}
