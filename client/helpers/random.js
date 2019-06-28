export function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}

export function getRandomItem(array) {
  const { length } = array;

  const index = getRandomIndex(length);

  return array[index];
}
