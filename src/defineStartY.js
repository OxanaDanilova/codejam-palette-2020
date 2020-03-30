const defineStartY = (y, matrix) => {
  let result;
  if (matrix === 4) {
    result = (y - 1) * 128;
  }
  if (matrix === 32) {
    result = (y - 1) * 16;
  }
  return result;
};

export default defineStartY;
