const addBtn = document.querySelector('#add_btn');
const removeAllBtn = document.querySelector('#remove_all_btn');
const refreshBtn = document.querySelector('#refresh_btn');
const doneBtn = document.querySelector('#done_btn');
const removeItemBtn = document.querySelector('#remove_item_btn');

const inputTask = document.querySelector('#input_task');
const tasks = document.querySelector('.tasks');
// const task = [...document.querySelectorAll('[value]')];

let itemCounter = 0;

const changeInputPlaceholder = (constructor) => {
  if (inputTask.value.length === 0) {
    inputTask.setAttribute('placeholder', 'wprowadź zadanie do zrealizowania!');
    setTimeout(() => {
      inputTask.setAttribute('placeholder', 'zadanie do zrealizowania...');
    }, 2200);
  } else {
    tasks.appendChild(constructor);
  }
};

const removeChilds = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

const buttonCreator = (idName, value, nameButton, target) => {
  const btn = document.createElement('button');
  btn.setAttribute('id', idName);
  btn.setAttribute('value', value);
  btn.setAttribute('type', 'button');
  btn.innerText = nameButton;

  target.appendChild(btn);
  return target;
};

const singleTaskCreator = (inputData, value) => {
  const contener = document.createElement('div');
  contener.className = 'task';

  const textContener = document.createElement('div');
  textContener.className = 'text_contener';
  const buttonContener = document.createElement('div');
  buttonContener.className = 'button_contener';

  textContener.setAttribute('value', value);
  textContener.innerText = inputData;
  contener.appendChild(textContener);

  contener.appendChild(buttonCreator('done_btn', value, 'Zrobione!', buttonContener));
  buttonCreator('remove_item_btn', value, 'Usuń z listy', buttonContener);

  return contener;
};

const sendDataToBackend = async () => {
  await fetch('http://127.0.0.1:3000/task', {
    method: 'POST',
    body: JSON.stringify({
      index: itemCounter,
      content: inputTask.value,
      done: false,
    }),
    headers: {
      'Content-type': 'application/json',
    },
  }).then(res => res.json())
    .then(data => {
      const { index, content } = data;
      singleTaskCreator(content, String(index));
    });
};

(async () => {
  const res = await fetch('http://127.0.0.1:3000/saved');
  const data = await res.json();
  const { taskStorage, updateItemCounter } = data;
  taskStorage.tasks.forEach(element => {
    tasks.appendChild(singleTaskCreator(element.content, element.index));
  });
  itemCounter = updateItemCounter;
})();

addBtn.addEventListener('click', async event => {
  itemCounter++;

  event.preventDefault();
  changeInputPlaceholder(singleTaskCreator(inputTask.value, String(itemCounter)));
  sendDataToBackend();
});

removeAllBtn.addEventListener('click', async () => {
  itemCounter = 0;

  const res = await fetch('http://127.0.0.1:3000/remove/all');
  const data = await res.json();
  if (data === true) removeChilds(tasks);
});

refreshBtn.addEventListener('click', async () => {
  const res = await fetch('http://127.0.0.1:3000/refresh');
  const data = await res.json();
  removeChilds(tasks);
  data.tasks.forEach(element => {
    tasks.appendChild(singleTaskCreator(element.content, element.index));
  });
});

doneBtn.addEventListener('click', async () => {
  console.log('hi');
});
