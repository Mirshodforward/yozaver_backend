import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateWordDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  text?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
