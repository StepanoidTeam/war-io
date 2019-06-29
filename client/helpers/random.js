export function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}

export function getRandomItem(array) {
  const { length } = array;

  if (length === 1) return array[0];

  const index = getRandomIndex(length);

  return array[index];
}
