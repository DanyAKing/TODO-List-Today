const plMonth = {
  1: 'styczeń',
  2: 'luty',
  3: 'marzec',
  4: 'kwiecień',
  5: 'maj',
  6: 'czerwiec',
  7: 'lipiec',
  8: 'sierpień',
  9: 'wrześień',
  10: 'październik',
  11: 'listopad',
  12: 'grudzień',
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
