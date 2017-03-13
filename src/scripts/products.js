import _ from 'lodash'

const countMin = 5;
const countMax = 25;

const priceMin = 10;
const priceMax = 1000;

const delayMin = 200;
const delayMax = 1500;

const titlePool = [
  'Good', 'Car', 'Toy', 'Kitten', 'Element', 'Pillar', 'Soup',
  'Book', 'Tree', 'Car', 'Engine', 'Table', 'Chair', 'Dog', 'Cat',
  'Armchair', 'Lightsaber', 'Spear', 'Shield', 'Coin', 'Map', 'Rat',
  'Burger', 'Mascara'
];

export const getProductsForCategory = (category) => {
  const delay = _.random(delayMin, delayMax);
  const count = _.random(countMin, countMax);
  const products = _.range(count).map(() => ({
    category,
    title: _.sample(titlePool),
    price: _.random(priceMin, priceMax)
  }));

  return new Promise((resolve, reject) => { setTimeout(() => { resolve(products) }, delay); })
};
