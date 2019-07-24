export const neighborhood = {
  //Von Neumann neighborhood ✜
  n4({ x, y, distance = 1 }) {
    //todo: impl dist > 1
    return [
      // distance 1
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
  },
  //Moore neighborhood □
  n8({ x, y, distance = 1 }) {
    //todo: impl
    return [];
  },
};
