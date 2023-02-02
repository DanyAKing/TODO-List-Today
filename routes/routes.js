const express = require('express');
const { writeFile } = require('fs').promises;
const { taskStorage } = require('../src/task-storage');
const { fetchDataOnStartup } = require('../src/fetch-data-on-startup');

const router = express.Router();
const FILE_PATH = './database/data.json';

fetchDataOnStartup(FILE_PATH, taskStorage);

router
  .post('/task', async (req, res) => {
    taskStorage.tasks.push(req.body);
    await writeFile(FILE_PATH, JSON.stringify(taskStorage), 'utf-8');
    console.log(taskStorage);

    res.json(req.body);
  })
  .get('/remove/all', async (req, res) => {
    taskStorage.tasks.splice(0, taskStorage.tasks.length);
    res.json(true);
  })
  .get('/saved', async (req, res) => {
    res.json(taskStorage);
  });

module.exports = { router, FILE_PATH };
