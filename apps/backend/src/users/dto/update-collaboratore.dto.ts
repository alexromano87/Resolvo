import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { NoSpecialChars } from '../../common/validators/no-special-chars.decorator';

export class UpdateCollaboratoreDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @NoSpecialChars()
  nome?: string;

  @IsString()
  @IsOptional()
  @NoSpecialChars()
  cognome?: string;

  @IsString()
  @IsOptional()
  @NoSpecialChars()
  telefono?: string | null;
}
