import defineStartX from './defineStartX';
import defineStartY from './defineStartY';

const fillUnit = (x, y, canvas, matrix) => {
  const startX = defineStartX(x, matrix);
  const startY = defineStartY(y, matrix);
  canvas.beginPath();
  canvas.fillRect(startX, startY, 526 / matrix, 526 / matrix);
  canvas.fill();
  return matrix;
};

export default fillUnit;
