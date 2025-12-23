// apps/backend/src/documenti/dto/update-documento.dto.ts
import { IsString, IsOptional, IsUUID } from 'class-validator';
import { NoSpecialChars } from '../../common/validators/no-special-chars.decorator';

export class UpdateDocumentoDto {
  @IsOptional()
  @IsString()
  @NoSpecialChars()
  nome?: string;

  @IsOptional()
  @IsString()
  @NoSpecialChars()
  descrizione?: string;

  @IsOptional()
  @IsUUID()
  cartellaId?: string | null;
}
