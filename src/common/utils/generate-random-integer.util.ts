/**
 * 난수 생성
 *
 * @param min 최소 정수
 * @param max 최대 정수
 * @return 난수
 */
export function generateRandomInteger(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
