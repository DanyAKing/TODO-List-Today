const plMonth = {
  1: 'stycznia',
  2: 'lutego',
  3: 'marca',
  4: 'kwietnia',
  5: 'maja',
  6: 'czerwca',
  7: 'lipca',
  8: 'sierpnia',
  9: 'września',
  10: 'października',
  11: 'listopada',
  12: 'grudnia',
};

const getDate = () => {
  const date = new Date();
  const today = date.getDate();
  const currentMonth = plMonth[date.getMonth() + 1];
  const year = date.getFullYear();

  const currentFullDate = `${today} ${currentMonth} ${year}`;

  return currentFullDate;
};

const secondHeader = document.querySelector('#second_header');
secondHeader.innerText = getDate();
