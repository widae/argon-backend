import { Transform, plainToInstance } from 'class-transformer';
import { IsInt, IsNotEmpty, validateSync } from 'class-validator';

export class EnvVars {
  @IsNotEmpty()
  NODE_ENV: string;

  @IsNotEmpty()
  MYSQL_HOST: string;
  @IsInt()
  @Transform(({ value }) => Number(value))
  MYSQL_PORT: string;
  @IsNotEmpty()
  MYSQL_USER: string;
  @IsNotEmpty()
  MYSQL_PASSWORD: string;
  @IsNotEmpty()
  MYSQL_SCHEMA: string;
}

export function validate(config: Record<string, unknown>) {
  const vars = plainToInstance(EnvVars, config, {
    enableImplicitConversion: true,
  });

  const errs = validateSync(vars, { skipMissingProperties: false });

  if (errs.length > 0) {
    throw new Error(errs.toString());
  }

  return vars;
}
