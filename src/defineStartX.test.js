import defineStartX from './defineStartX';


test('Check StartX, if matrix equal 4', () => {
  expect(defineStartX(2, 4)).toBe(128);
});

test('Check StartX, if matrix equal 32', () => {
  expect(defineStartX(2, 32)).toBe(16);
});
