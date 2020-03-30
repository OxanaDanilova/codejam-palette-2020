const defineStartX = (x, matrix) => {
  let result;
  if (matrix === 4) {
    result = (x - 1) * 128;
  }
  if (matrix === 32) {
    result = (x - 1) * 16;
  }
  return result;
};

export default defineStartX;
