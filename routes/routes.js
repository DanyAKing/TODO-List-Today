const express = require('express');
const { writeFile } = require('fs').promises;
const { taskStorage } = require('../src/task-storage');
const { fetchDataOnStartup } = require('../src/fetch-data-on-startup');

const router = express.Router();
const FILE_PATH = './database/data.json';

fetchDataOnStartup(FILE_PATH, taskStorage);
const itemCounter = 0;

router
  .post('/task', async (req, res) => {
    taskStorage.tasks.push(req.body);
    await writeFile(FILE_PATH, JSON.stringify(taskStorage), 'utf-8');

    console.log('Added:');
    console.log(req.body);

    res.json(itemCounter, taskStorage);
  })
  .get('/remove/all', async (req, res) => {
    taskStorage.tasks.splice(0, taskStorage.tasks.length);
    await writeFile(FILE_PATH, JSON.stringify(taskStorage), 'utf-8');
    res.json(true);
    console.log('Removed list.');
  })
  .post('/remove/item', async (req, res) => {
    const { element } = req.body;
    taskStorage.tasks.splice(element - 1, 1);
    await writeFile(FILE_PATH, JSON.stringify(taskStorage), 'utf-8');
    res.json(200, itemCounter, taskStorage);
  })
  .get('/refresh', async (req, res) => {
    res.json(200, itemCounter, taskStorage);
  })
  .get('/saved', async (req, res) => {
    res.json({ itemCounter, taskStorage });
  })
  .post('/done', async (req, res) => {
    console.log(req.body);
  });

module.exports = { router, FILE_PATH };
