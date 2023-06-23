import { HttpException, HttpExceptionOptions } from '@nestjs/common';

export type ErrCode =
  | 'E_400_000'
  | 'E_401_000'
  | 'E_403_000'
  | 'E_404_000'
  | 'E_409_001'
  | 'E_500_000';

interface CodeAndMsg {
  statusCode: number;
  errMessage: string;
}

const extras: Record<ErrCode, CodeAndMsg> = {
  E_400_000: { statusCode: 400, errMessage: '유효하지 않은 요청입니다.' },
  E_401_000: {
    statusCode: 401,
    errMessage: '유효한 증명 자격이 없습니다.',
  },
  E_403_000: { statusCode: 403, errMessage: '권한이 없습니다.' },
  E_404_000: { statusCode: 404, errMessage: '요청 자원을 찾을 수 없습니다.' },
  E_409_001: {
    statusCode: 409,
    errMessage: '이메일 주소가 중복됩니다.',
  },
  E_500_000: {
    statusCode: 500,
    errMessage: '예상치 못한 오류가 발생했습니다.',
  },
};

export class CustomHttpException extends HttpException {
  constructor(errCode: ErrCode, options?: HttpExceptionOptions) {
    super({ errCode, ...extras[errCode] }, extras[errCode].statusCode, options);
  }
}
