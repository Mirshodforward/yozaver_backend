import { IsIn, IsInt, IsNumber, Max, Min } from 'class-validator';

export class CreateResultDto {
  @IsNumber()
  @Min(0)
  @Max(400)
  wpm: number;

  @IsNumber()
  @Min(0)
  @Max(400)
  rawWpm: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy: number;

  @IsInt()
  @Min(0)
  correctChars: number;

  @IsInt()
  @Min(0)
  incorrectChars: number;

  @IsInt()
  @Min(0)
  extraChars: number;

  @IsInt()
  @Min(0)
  missedChars: number;

  @IsInt()
  @Min(1)
  @Max(3600)
  durationSeconds: number;

  @IsIn(['TIME', 'WORDS'])
  mode: 'TIME' | 'WORDS';

  @IsInt()
  @Min(1)
  modeValue: number;

  @IsIn(['en', 'uz'])
  language: 'en' | 'uz';
}
