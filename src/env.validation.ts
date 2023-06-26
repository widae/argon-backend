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

  @IsNotEmpty()
  AWS_ACCESS_KEY_ID: string;
  @IsNotEmpty()
  AWS_SECRET_ACCESS_KEY: string;
  @IsNotEmpty()
  AWS_REGION: string;

  @IsNotEmpty()
  EMAIL_SENDER_ADDR: string;
  @IsNotEmpty()
  EMAIL_VERIFICATION_TEMPLATE_ID: string;
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
