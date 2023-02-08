const addBtn = document.querySelector('#add_btn');
const removeAllBtn = document.querySelector('#remove_all_btn');
const refreshBtn = document.querySelector('#refresh_btn');

const inputTask = document.querySelector('#input_task');
const tasks = document.querySelector('.tasks');

const removeChilds = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

const buttonCreator = (idName, id, value, nameButton) => {
  const btn = document.createElement('button');
  btn.setAttribute('id', idName);
  btn.setAttribute(id, value);
  btn.setAttribute('type', 'button');
  btn.innerText = nameButton;

  return btn;
};

const singleTaskCreator = (content, done, value) => {
  const taskContener = document.createElement('div');
  taskContener.classList = 'task';

  if (done === true) {
    taskContener.classList = 'task text_done';
  }

  taskContener.setAttribute('task-id', value);

  const text = document.createElement('div');
  text.classList = 'text';
  text.innerText = `${Number(value) + 1}. ${content}`;
  taskContener.appendChild(text);

  taskContener.appendChild(buttonCreator('done_btn', 'done-btn-id', value, 'Zrobione!'));
  taskContener.appendChild(buttonCreator('remove_item_btn', 'remove-btn-id', value, 'Usuń!'));

  return taskContener;
};

const removeItemBtn = async () => {
  const task = document.querySelector('.task');
  const btns = [...document.querySelectorAll('[remove-btn-id]')];

  if (task === null) return;

  for (const btn of btns) {
    btn.addEventListener('click', async () => {
      const id = btn.parentElement.getAttribute('task-id');
      await fetch('/remove/item', {
        method: 'POST',
        body: JSON.stringify({ element: id }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data === true) getDataFromBackend();
        });
    });
  }
};

const doneBtn = async () => {
  const task = document.querySelector('.task');
  const btns = [...document.querySelectorAll('[done-btn-id]')];

  if (task === null) return;

  for (const btn of btns) {
    btn.addEventListener('click', async () => {
      const target = btn.parentNode;
      const taskId = target.getAttribute('task-id');
      target.classList.toggle('text_done');

      if (target.classList.contains('text_done')) {
        await fetch('/done', {
          method: 'POST',
          body: JSON.stringify({ done: true, id: taskId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await fetch('/done', {
          method: 'POST',
          body: JSON.stringify({ done: false, id: taskId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    });
  }
};

const sendDataToBackend = async () => {
  await fetch('/task', {
    method: 'POST',
    body: JSON.stringify({
      content: inputTask.value,
      done: false,
    }),
    headers: {
      'Content-type': 'application/json',
    },
  });
};

const refresh = async () => {
  await fetch('/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh: true }),
    headers: {
      'Content-type': 'application/json',
    },
  });
};

const getDataFromBackend = async () => {
  const res = await fetch('/saved');
  const data = await res.json();

  let { itemCounter } = data;
  const { dataFromFile } = data;

  removeChilds(tasks);
  dataFromFile.tasks.forEach(element => {
    tasks.appendChild(singleTaskCreator(element.content, element.done, String(itemCounter++)));
  });
  doneBtn();
  removeItemBtn();
};

getDataFromBackend();

addBtn.addEventListener('click', async event => {
  event.preventDefault();

  sendDataToBackend();
  getDataFromBackend();
});

removeAllBtn.addEventListener('click', async () => {
  const res = await fetch('/remove/all');
  const data = await res.json();

  if (data === true) removeChilds(tasks);
});

refreshBtn.addEventListener('click', async () => {
  refresh();
  getDataFromBackend();
});
