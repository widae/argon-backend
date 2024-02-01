/**
 * 파일 유효성 확인 옵션들
 */
export interface FileValidationOptions {
  /** 허용 MIME 유형들 */
  mimetypes?: string[];
  /** 최대 바이트 수 */
  maxBytes?: number;
}
