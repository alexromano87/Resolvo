// apps/backend/src/cartelle/dto/update-cartella.dto.ts
import { IsString, IsOptional, IsUUID } from 'class-validator';
import { NoSpecialChars } from '../../common/validators/no-special-chars.decorator';

export class UpdateCartellaDto {
  @IsOptional()
  @IsString()
  @NoSpecialChars()
  nome?: string;

  @IsOptional()
  @IsString()
  @NoSpecialChars()
  descrizione?: string;

  @IsOptional()
  @IsString()
  colore?: string;

  @IsOptional()
  @IsUUID()
  cartellaParentId?: string;
}
