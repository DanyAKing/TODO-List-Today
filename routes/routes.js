const express = require('express');
const { writeFile, readFile } = require('fs').promises;
const { taskStorage } = require('../src/task-storage');

const router = express.Router();
const FILE_PATH = './database/data.json';

router
  .post('/task', async (req, res) => {
    taskStorage.tasks.push(req.body);
    await writeFile(FILE_PATH, JSON.stringify(taskStorage), 'utf-8');
    console.log(taskStorage.tasks);

    res.json(req.body);
  })
  .get('/saved', async (req, res) => {
    const savedData = await readFile(FILE_PATH, 'utf-8');
    res.json(savedData);
  });

module.exports = { router };
