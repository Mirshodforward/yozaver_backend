import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateWordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  text: string;

  @IsIn(['en', 'uz'])
  lang: 'en' | 'uz';
}
