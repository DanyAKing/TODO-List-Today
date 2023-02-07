const { readFile } = require('fs').promises;
const { taskStorage } = require('./task-storage');

const fetchDataOnStartup = async (filePath) => {
  const res = await readFile(filePath, 'utf-8');
  try {
    const data = JSON.parse(res);
    const filteredData = data.tasks.filter(item => item.done !== true);
    taskStorage.tasks = filteredData;

    console.log('Restored last session:');
    console.log(taskStorage);
  } catch (e) {
    console.error('Database is empty.', e.message);
  }
};

module.exports = { fetchDataOnStartup };
