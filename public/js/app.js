const addBtn = document.querySelector('#add_btn');
const removeAllBtn = document.querySelector('#remove_all_btn');
const refreshBtn = document.querySelector('#refresh_btn');
const removeItemBtn = document.querySelectorAll('#remove_item_btn');
// // const removeItemBtn = [...document.querySelectorAll('[btn-id]')];
// const doneBtn = document.querySelector('#done_btn');

const inputTask = document.querySelector('#input_task');
const tasks = document.querySelector('.tasks');

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

// const removeTask = async () => {
//   const btn = [...document.querySelectorAll('#remove_item_btn')];
//   for (let i = 0; btn.length; i++) {
//     console.log(btn);
//   }
// };

const buttonCreator = (idName, value, nameButton, target, task) => {
  const btn = document.createElement('button');
  btn.setAttribute('id', idName);
  btn.setAttribute('btn-id', value);
  btn.setAttribute('type', 'button');
  btn.setAttribute('onclick', task);
  btn.innerText = nameButton;

  target.appendChild(btn);
  return target;
};

const singleTaskCreator = (inputData, value) => {
  const taskContener = document.createElement('div');
  taskContener.className = 'task';
  taskContener.setAttribute('task-id', value);

  const textContener = document.createElement('div');
  textContener.className = 'text_contener';
  const buttonContener = document.createElement('div');
  buttonContener.className = 'button_contener';

  textContener.innerText = inputData;
  taskContener.appendChild(textContener);

  taskContener.appendChild(buttonCreator('done_btn', value, 'Zrobione!', buttonContener, 'removeTask()'));
  buttonCreator('remove_item_btn', value, 'Usuń z listy', buttonContener, 'removeTask()');

  return taskContener;
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

removeItemBtn.addEventListener('click', () => {
  console.log('hi');
})