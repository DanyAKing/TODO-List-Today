const express = require('express');
const { writeFile } = require('fs').promises;
const { taskStorage } = require('../src/task-storage');
const { fetchDataOnStartup } = require('../src/fetch-data-on-startup');

const router = express.Router();
const FILE_PATH = './database/data.json';

const saveData = async () => {
  await writeFile(FILE_PATH, JSON.stringify(taskStorage), 'utf-8');
};
const response = (res) => res.status(200).json({ itemCounter, taskStorage });

fetchDataOnStartup(FILE_PATH, taskStorage.tasks);
const itemCounter = 0;

router
  .post('/task', async (req, res) => {
    taskStorage.tasks.push(req.body);

    saveData();
    res.sendStatus(200);

    console.log('Added task:');
    console.log(taskStorage);
  })
  .get('/remove/all', async (req, res) => {
    taskStorage.tasks.splice(0, taskStorage.tasks.length);

    saveData();
    res.status(200).json(true);

    console.log('Remove all list.');
  })
  .post('/remove/item', async (req, res) => {
    const { element } = req.body;
    taskStorage.tasks.splice(element, 1);

    saveData();
    response(res);

    console.log('Remove item:');
    console.log(taskStorage);
  })
  .get('/saved', async (req, res) => {
    response(res);
  })
  .post('/done', async (req, res) => {
    const { done, id } = req.body;
    taskStorage.tasks[id].done = done;

    console.log('Change done status:');
    console.log(taskStorage);

    saveData();
    res.sendStatus(200);
  })
  .post('/refresh', async (req, res) => {
    const { refresh } = req.body;
    if (refresh === true) taskStorage.tasks.filter(item => item.done !== true);
    response(res);
  });

module.exports = { router, FILE_PATH };
