export const generateQuantities = () => {
  let quantities = [];

  for (let i = 0; i <= 10; i++) quantities.push(i);

  return quantities;
};

export const calculateTotal = (list) => {
  let newTotal = 0;

  for (const item in list) {
    newTotal += list[item].units * list[item].cost;
  }

  return newTotal;
};

export const fetchFromLocalStorage = (key) => {
  const localData = localStorage.getItem(key);

  if (localData) return JSON.parse(localData);
}

export const removeFromLocalStorage = (key) => {
  const existingData = localStorage.getItem(key);
  if (existingData) localStorage.removeItem(key);
}
