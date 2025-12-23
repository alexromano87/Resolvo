import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { NoSpecialChars } from '../../common/validators/no-special-chars.decorator';

export class CreateCollaboratoreDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  @IsNotEmpty()
  @NoSpecialChars()
  nome: string;

  @IsString()
  @IsNotEmpty()
  @NoSpecialChars()
  cognome: string;

  @IsOptional()
  @IsString()
  @NoSpecialChars()
  telefono?: string | null;

  @IsOptional()
  @IsUUID()
  studioId?: string | null;
}
