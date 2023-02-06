const addBtn = document.querySelector('#add_btn');
const removeAllBtn = document.querySelector('#remove_all_btn');
const refreshBtn = document.querySelector('#refresh_btn');

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

const buttonCreator = (idName, id, value, nameButton) => {
  const btn = document.createElement('button');
  btn.setAttribute('id', idName);
  btn.setAttribute(id, value);
  btn.setAttribute('type', 'button');
  btn.innerText = nameButton;

  return btn;
};

const singleTaskCreator = (inputData, value) => {
  const taskContener = document.createElement('div');
  taskContener.className = 'task';
  taskContener.setAttribute('task-id', value);

  const text = document.createElement('div');
  text.className = 'text';
  text.innerText = inputData;
  taskContener.appendChild(text);

  taskContener.appendChild(buttonCreator('done_btn', 'done-btn-id', value, 'Zrobione!'));
  taskContener.appendChild(buttonCreator('remove_item_btn', 'remove-btn-id', value, 'Usuń!'));

  return taskContener;
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
  })
    .then(res => res.json())
    .then(data => {
      let { itemCounter, taskStorage } = data;
      // const { taskStorage } = data;
      removeChilds(tasks);
      taskStorage.tasks.forEach(element => {
        tasks.appendChild(singleTaskCreator(element.content, String(itemCounter++)));
      });
    });
};

const taskBtnAction = () => {
  const task = [...document.querySelectorAll('[task-id]')];
  const doneBtn = [...document.querySelectorAll('[done-btn-id]')];
  const removeItemBtn = [...document.querySelectorAll('[remove-btn-id]')];

  for (const btn of doneBtn) {
    btn.addEventListener('click', () => {
      const btnId = btn.getAttribute('done-btn-id');
      for (const singleTask of task) {
        const taskId = singleTask.getAttribute('task-id');
        if (taskId === btnId) singleTask.classList.toggle('text_done');
      }
    });
  }

  for (const btn of removeItemBtn) {
    btn.addEventListener('click', () => {
      const btnId = btn.getAttribute('remove-btn-id');
      fetch('http://127.0.0.1:3000/remove/item', {
        method: 'POST',
        body: JSON.stringify({ element: btnId }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          let { itemCounter } = data;
          const { taskStorage } = data;
          removeChilds(tasks);
          taskStorage.tasks.forEach(element => {
            tasks.appendChild(singleTaskCreator(element.content, String(itemCounter++)));
          });
        });

      for (const singleTask of task) {
        const taskId = singleTask.getAttribute('task-id');
        if (taskId === btnId) tasks.removeChild(singleTask);
      }
    });
  }
};

(async () => {
  const res = await fetch('http://127.0.0.1:3000/saved');
  const data = await res.json();
  localStorage.setItem('taskStorage', JSON.stringify(data));

  let { itemCounter } = data;
  const { taskStorage } = data;
  taskStorage.tasks.forEach(element => {
    tasks.appendChild(singleTaskCreator(element.content, String(itemCounter++)));
  });

  taskBtnAction();
})();

let { itemCounter } = JSON.parse(localStorage.getItem('taskStorage'));

addBtn.addEventListener('click', async event => {
  event.preventDefault();
  changeInputPlaceholder(singleTaskCreator(inputTask.value, String(itemCounter++)));
  taskBtnAction();
  sendDataToBackend();
});

removeAllBtn.addEventListener('click', async () => {
  const res = await fetch('http://127.0.0.1:3000/remove/all');
  const data = await res.json();
  if (data === true) removeChilds(tasks);
});

refreshBtn.addEventListener('click', async () => {
  const res = await fetch('http://127.0.0.1:3000/refresh');
  const data = await res.json();
  removeChilds(tasks);
  const { taskStorage } = data;
  taskStorage.tasks.forEach(element => {
    tasks.appendChild(singleTaskCreator(element.content, String(itemCounter++)));
  });
});
