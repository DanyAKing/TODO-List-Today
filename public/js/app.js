const addBtn = document.querySelector('#add_btn');
const inputTask = document.querySelector('#input_task');
const tasks = document.querySelector('#tasks');

const simpleTaskCreator = inputData => {
  const task = document.createElement('p');
  task.innerText = inputData;
  return task;
};

addBtn.addEventListener('click', async () => {
  if (inputTask.value.length === 0) {
    inputTask.setAttribute('placeholder', 'wprowadź zadanie do zrealizowania!');
    setTimeout(() => {
      inputTask.setAttribute('placeholder', 'zadanie do zrealizowania...');
    }, 2500);
  } else {
    tasks.appendChild(simpleTaskCreator(inputTask.value));
  }
});
