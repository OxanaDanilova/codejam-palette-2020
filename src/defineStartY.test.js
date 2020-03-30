import defineStartY from './defineStartY';


test('Check StartY, if matrix equal 4', () => {
  expect(defineStartY(2, 4)).toBe(128);
});

test('Check StartY, if matrix equal 32', () => {
  expect(defineStartY(2, 32)).toBe(16);
});
