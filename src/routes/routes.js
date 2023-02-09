const express = require('express');
const { writeFile, readFile } = require('fs').promises;
const { taskStorage } = require('../task-storage');
const { fetchDataOnStartup } = require('../fetch-data-on-startup');

const router = express.Router();
const FILE_PATH = './src/database/data.json';

const saveData = async (target) => {
  await writeFile(FILE_PATH, JSON.stringify(target), 'utf-8');
};
const response = async (res, itemCounter) => {
  const getDataFromFile = await readFile(FILE_PATH, 'utf-8');
  const dataFromFile = JSON.parse(getDataFromFile);
  res.status(200).json({ itemCounter, dataFromFile });
};

fetchDataOnStartup(FILE_PATH, taskStorage.tasks);
const itemCounter = 0;

router
  .post('/task', async (req, res) => {
    taskStorage.tasks.push(req.body);

    saveData(taskStorage);
    res.sendStatus(200);

    console.log('Added task:');
    console.log(taskStorage);
  })
  .get('/remove/all', async (req, res) => {
    taskStorage.tasks.splice(0, taskStorage.tasks.length);

    saveData(taskStorage);
    res.status(200).json(true);

    console.log('Remove all list.');
  })
  .post('/remove/item', async (req, res) => {
    const { element } = req.body;
    taskStorage.tasks.splice(element, 1);

    saveData(taskStorage);
    res.status(200).json(true);

    console.log('Remove item:');
    console.log(taskStorage);
  })
  .post('/done', async (req, res) => {
    const { done, id } = req.body;
    taskStorage.tasks[Number(id)].done = done;

    console.log('Change done status:');
    console.log(taskStorage);

    saveData(taskStorage);
    res.sendStatus(200);
  })
  .post('/refresh', async (req, res) => {
    const { refresh } = req.body;

    const filteredList = taskStorage.tasks.filter(el => el.done !== true);
    taskStorage.tasks = filteredList;

    console.log('Refresh list.');
    console.log(taskStorage);

    saveData(taskStorage);
    res.sendStatus(200);
  })
  .get('/saved', async (req, res) => {
    response(res, itemCounter);
  });

module.exports = { router, FILE_PATH };
