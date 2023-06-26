export function genNumCode(len: number) {
  let code = '';

  for (let i = 0; i < len; i++) {
    code += Math.floor(Math.random() * 10);
  }

  return code;
}
