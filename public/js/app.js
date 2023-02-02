const addBtn = document.querySelector('#add_btn');
const removeAllBtn = document.querySelector('#remove_all_btn');
const inputTask = document.querySelector('#input_task');
const tasks = document.querySelector('.tasks');

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

const buttonCreator = (idName, nameButton, target) => {
  const btn = document.createElement('button');
  btn.setAttribute('id', idName);
  btn.setAttribute('type', 'button');
  btn.innerText = nameButton;

  target.appendChild(btn);
  return target;
};

const singleTaskCreator = (inputData) => {
  const contener = document.createElement('div');
  contener.className = 'task';

  const textContener = document.createElement('div');
  textContener.className = 'text_contener';
  const buttonContener = document.createElement('div');
  buttonContener.className = 'button_contener';

  textContener.className = 'textContener';
  textContener.innerText = inputData;
  contener.appendChild(textContener);

  contener.appendChild(buttonCreator('remove_btn', 'Usuń', buttonContener));
  buttonCreator('edit_btn', 'Zrobione', buttonContener);

  return contener;
};

const sendDataToBackend = async () => {
  await fetch('http://127.0.0.1:3000/task', {
    method: 'POST',
    body: JSON.stringify({
      content: inputTask.value,
      done: false,
    }),
    headers: {
      'Content-type': 'application/json',
    },
  }).then(res => res.json())
    .then(data => {
      const { content } = data;
      singleTaskCreator(content);
    });
};

(async () => {
  const res = await fetch('http://127.0.0.1:3000/saved');
  const data = await res.json();
  data.tasks.forEach(element => {
    tasks.appendChild(singleTaskCreator(element.content));
  });
})();

addBtn.addEventListener('click', async event => {
  event.preventDefault();
  changeInputPlaceholder(singleTaskCreator(inputTask.value));
  sendDataToBackend();
});

removeAllBtn.addEventListener('click', async () => {
  const res = await fetch('http://127.0.0.1:3000/remove/all');
  const data = await res.json();
  if (data === true) removeChilds(tasks);
});
